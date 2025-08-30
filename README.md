# Lost & Found Portal

A modern, cloud-based web application that makes reporting and managing lost and found items simple and reliable. The system includes an **intelligent approval workflow** so that items can be reviewed before being published. Built with the **MERN stack** and styled with **Tailwind CSS** for a clean, modern UI.

---

## ✨ Features at a Glance

* 🔐 **Secure Authentication** – JWT-based login with role-based access
* 🌙 **Dark Mode UI** – Modern, responsive interface built with Tailwind CSS
* ☁️ **Cloud Database** – MongoDB Atlas for global access and scalability
* 🛡️ **Smart Moderation** – Submissions go through an approval workflow
* 🔎 **Advanced Search & Filters** – Find items quickly by category, type, or location
* 📱 **Mobile-First** – Designed to look and work great on all devices

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (v16 or later)
* npm or yarn
* A MongoDB Atlas account (free tier works fine)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lost-found-app
npm install
cd client && npm install && cd ..
```

### 2. Set Up Environment Variables

Create a `config.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### 3. Create a Moderator Account

```bash
# Create a default moderator
node scripts/setup-moderator.js

# Or create your own moderator
node scripts/create-moderator.js username email password
```

### 4. Run the Application

```bash
# Option 1: Use batch file (Windows)
start.bat

# Option 2: Start manually
npm run dev          # Backend (http://localhost:5000)
npm run client       # Frontend (http://localhost:3000)
```

---

## 👥 User Roles

### Default Accounts

* **Moderator**: `moderator@example.com` / `moderator123`
* **Admin**: `admin@example.com` / `admin123`

### Regular User

* Submit lost/found items
* Browse approved items
* Claim found items
* Manage personal posts

### Moderator

* Review and approve/reject items
* Manage content via dashboard
* View statistics and reports

---

## 🏗️ System Architecture

```
Frontend (React + Tailwind)  <->  Backend (Node.js + Express)  <->  MongoDB Atlas
```

### Tech Stack

* **Frontend**: React 18, Tailwind CSS, React Router
* **Backend**: Node.js, Express, JWT, bcrypt
* **Database**: MongoDB Atlas
* **Styling**: Tailwind CSS with custom dark theme

---

## 📸 Snapshots

| Home Page | Item Details | Add Item |
|-----------|--------------|----------|
| <img width="1884" height="951" alt="Home Page" src="https://github.com/user-attachments/assets/f924c5cb-c276-42b5-aa0d-d4ad799c6434" /> | <img width="1183" height="608" alt="Item Details" src="https://github.com/user-attachments/assets/1daf40ee-2fe5-4bf2-a193-85210253ceaf" /> | <img width="1253" height="912" alt="Add Item" src="https://github.com/user-attachments/assets/0a102c3b-e6a4-4012-9985-a4160c9e6508" /> |

| Lost Request | Moderator Dashboard |
|--------------|----------------------|
| <img width="489" height="275" alt="Lost Request" src="https://github.com/user-attachments/assets/fc34dd4c-5be4-4f10-b594-31ba29e7d263" /> | <img width="1253" height="831" alt="Moderator Dashboard" src="https://github.com/user-attachments/assets/a27a2a43-8d74-4804-b2cb-fda1e1abf2b5" /> |

---



## 🔧 Management Scripts

```bash
# List all moderators
node scripts/list-moderators.js

# Create a new moderator
node scripts/create-moderator.js username email password

# Setup default moderator
node scripts/setup-moderator.js
```

---

## 📊 API Overview

* `POST /api/auth/login` – User authentication
* `POST /api/items` – Submit a new item
* `GET /api/items` – Browse/search items
* `POST /api/moderators/:id/approve` – Approve an item
* `POST /api/moderators/:id/reject` – Reject an item

---

## 🌟 Highlights

* ✅ Integrated with **MongoDB Atlas** (cloud database)
* ✅ Clean **Dark UI** using Tailwind CSS
* ✅ Built-in **Moderator tools** for managing posts
* ✅ Fully **responsive** for mobile and desktop
* ✅ Secure **authentication** with JWT + bcrypt

---


## 🤝 Support

* Open an issue on GitHub for bugs or feature requests
* Check inline code comments for documentation
* Review the `scripts/` folder for setup help

---


