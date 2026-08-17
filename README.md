# 🌱 Farm2Home — Connecting Farmers Directly with Consumers

**Farm2Home** is a full-stack web application designed to create a direct connection between **farmers and consumers**. The platform allows users to explore agricultural products, view product information, connect with farmers, and purchase fresh produce through a user-friendly web interface.

The project aims to reduce unnecessary intermediaries in the agricultural supply chain while providing farmers with better access to customers and consumers with easier access to fresh farm products.

## 🚀 Live Demo

🔗 **[Farm2Home — Live Website](https://mini-project2-umber.vercel.app/)**

## 🎯 Objectives

* Connect farmers directly with consumers.
* Provide an online marketplace for agricultural products.
* Make fresh and locally sourced products easier to discover.
* Provide farmers with a digital platform to showcase their products.
* Implement secure user authentication and backend APIs.
* Build a responsive and user-friendly web experience.

## ✨ Features

### 👨‍🌾 Farmer Side

* Farmer-oriented product interface
* Add and manage agricultural products
* Product information and availability
* Connect with potential customers

### 🛒 Consumer Side

* Browse agricultural products
* Explore different product categories
* View product details
* Purchase products through the platform
* Contact farmers for product-related queries

### 🔐 Authentication & Security

* User registration and login
* Password hashing using **bcrypt**
* Authentication using **JWT**
* Input validation using **Express Validator**
* Environment-variable based configuration

### 📦 Product Management

* Product listing
* Product categorization
* Product images
* Product details
* File/image upload support

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* React
* TypeScript
* Vite

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs

### Authentication & Backend Utilities

* JWT
* bcryptjs
* Express Validator
* CORS
* dotenv
* Multer

### Deployment

* Vercel
* Render

The repository currently contains a dedicated frontend, a React/TypeScript website, and a Node.js server using Express, Mongoose, JWT, bcryptjs, Multer and related backend packages.

## 📁 Project Structure

```text
MiniProject2/
│
├── Basic_Website/
│   └── frontend/
│       ├── css/
│       ├── images/
│       ├── js/
│       ├── index.html
│       ├── login.html
│       ├── buy.html
│       ├── contact.html
│       ├── contactfarmer.html
│       ├── fruit.html
│       ├── leafy.html
│       └── ...
│
├── website/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── config/
│   ├── docs/
│   ├── src/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── api/
│   └── index.js
│
├── package.json
├── render.yaml
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devashreep22/MiniProject2.git
cd MiniProject2
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional environment variables required by your local configuration.

### 4. Start the Backend

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

### 5. Start the Frontend

Open another terminal:

```bash
cd website
npm install
npm run dev
```

Vite will provide a local development URL in the terminal.

## 🔄 Application Flow

```text
                 ┌──────────────────┐
                 │      User        │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │    Frontend      │
                 │ React / Web UI   │
                 └────────┬─────────┘
                          │
                    REST API Calls
                          │
                          ▼
                 ┌──────────────────┐
                 │  Express Server  │
                 │    Node.js       │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │     MongoDB      │
                 │    Database      │
                 └──────────────────┘
```

## 🔑 Authentication Flow

```text
User Registration
       ↓
Input Validation
       ↓
Password Hashing
       ↓
MongoDB
       ↓
Login
       ↓
JWT Generation
       ↓
Authenticated Requests
```

## 🌾 Why Farm2Home?

Traditional agricultural supply chains can involve several intermediaries between farmers and consumers. Farm2Home explores a digital approach where farmers can present their products directly to customers.

### Benefits

**For Farmers**

* Wider customer reach
* Digital product visibility
* Direct communication with consumers
* Better opportunity to market farm products

**For Consumers**

* Easier access to agricultural products
* Product information in one place
* Direct farmer interaction
* Convenient online browsing and purchasing

## 🧪 Development

The backend uses a modular Node.js/Express structure with separate configuration, source, documentation and upload directories. The server package also provides separate development and production start scripts.

To contribute:

```bash
git checkout -b feature/your-feature
```

Make your changes, test them locally, and then create a pull request.

## 📌 Future Enhancements

* 💳 Online payment integration
* 📍 Location-based farmer discovery
* 🚚 Order and delivery tracking
* ⭐ Product and farmer ratings
* 🔔 Notifications
* 📊 Farmer analytics dashboard
* 🤖 AI-based crop/product recommendations
* 📱 Progressive Web App support
* 🗺️ Map-based farmer discovery

## 👩‍💻 Author

**Devashree Madhav Pathak**

B.Tech — Artificial Intelligence & Data Science

GitHub: [@devashreep22](https://github.com/devashreep22)

## 📄 License

This project was developed as an academic mini-project for learning and demonstrating full-stack web development concepts.
