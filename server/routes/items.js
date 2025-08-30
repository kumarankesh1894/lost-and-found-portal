const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { auth } = require('../middleware/auth');

const router = express.Router();
 
router.post('/', auth, [
  body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').isIn(['electronics', 'clothing', 'jewelry', 'books', 'documents', 'other']).withMessage('Invalid category'),
  body('type').isIn(['lost', 'found']).withMessage('Type must be either lost or found'),
  body('location').notEmpty().withMessage('Location is required'),
  body('date').isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const itemData = {
      ...req.body,
      reporter: req.user._id,
      contactInfo: {
        phone: req.user.phone,
        email: req.user.email
      }
    };

    const item = new Item(itemData);
    await item.save();

     
    const notificationData = {
      message: `New ${item.type} item submitted: ${item.title}`,
      type: 'item_submitted'
    };
    
     
    console.log(`NOTIFICATION: ${notificationData.message}`);

    res.status(201).json({
      message: 'Item submitted successfully and pending approval',
      item
    });
  } catch (error) {
    console.error('Item submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.get('/', async (req, res) => {
  try {
    const { type, category, search, page = 1, limit = 10 } = req.query;
    
    const query = { status: 'approved' };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.$text = { $search: search };
    }

    const items = await Item.find(query)
      .populate('reporter', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.get('/my-items', auth, async (req, res) => {
  try {
    const items = await Item.find({ reporter: req.user._id })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Get my items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reporter', 'username email phone')
      .populate('claimant', 'username email phone')
      .populate('moderator', 'username');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

     
    const isPublicVisible = item.status === 'approved' || item.status === 'claimed';

    if (!isPublicVisible) {
       
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        return res.status(403).json({ message: 'Access denied' });
      }

    
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET || 'fallback-secret');
        const User = require('../models/User');
        const viewer = await User.findById(decoded.userId).select('role');
        const isOwner = item.reporter && item.reporter._id.toString() === decoded.userId;
        const isStaff = viewer && (viewer.role === 'moderator' || viewer.role === 'admin');
        if (!isOwner && !isStaff) {
          return res.status(403).json({ message: 'Access denied' });
        }
      } catch (e) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(item);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

 
router.put('/:id', auth, [
  body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().isIn(['electronics', 'clothing', 'jewelry', 'books', 'documents', 'other']).withMessage('Invalid category'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
  body('date').optional().isISO8601().withMessage('Valid date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    
    if (item.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own items' });
    }

    if (item.status !== 'pending') {
      return res.status(400).json({ message: 'Can only update pending items' });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending' }, 
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Item updated successfully and pending re-approval',
      item: updatedItem
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
 

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own items' });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/:id/claim', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.type !== 'found') {
      return res.status(400).json({ message: 'Can only claim found items' });
    }

    if (item.status !== 'approved') {
      return res.status(400).json({ message: 'Can only claim approved items' });
    }

     
    if (item.reporter.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot claim your own item' });
    }

    if (item.claimant) {
      return res.status(400).json({ message: 'Item already claimed' });
    }

   
    item.status = 'claimed';
    item.claimant = req.user._id;
    item.claimedAt = new Date();
    await item.save();

     
    const notificationData = {
      message: `Your found item "${item.title}" has been claimed by ${req.user.username}`,
      type: 'item_claimed'
    };
    
    console.log(` NOTIFICATION: ${notificationData.message}`);

    res.json({
      message: 'Item claimed successfully',
      item
    });
  } catch (error) {
    console.error('Claim item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
