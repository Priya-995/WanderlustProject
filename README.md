# 🌍 WanderLust -  Full Stack Rental Platform

<div align="center">

![WanderLust](https://img.shields.io/badge/WanderLust-Rental%20Platform-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express.js](https://img.shields.io/badge/Express.js-4.18-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A full-stack rental platform inspired by Airbnb**

[🔗 Live Demo](https://wanderlust-project-25gj.onrender.com/listings)
</div>

---

## 📖 About The Project

WanderLust is a comprehensive rental platform that replicates core Airbnb functionalities. Users can explore unique accommodations, list their properties, and manage bookings through an intuitive interface. The platform features secure authentication, image uploads, category filtering, and a responsive design.

### ✨ Key Features

- 🔐 **Secure Authentication** - Session-based auth with Passport.js
- 🏠 **Property Listings** - Full CRUD operations for property management
- 📸 **Image Upload** - Cloudinary integration for image storage
- 🗂️ **Category Filtering** - Browse by Beachfront, Mountains, Countryside, Urban
- 💳 **Pricing Display** - Price breakdown with GST calculations
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔍 **Search Functionality** - Quick property search
- ⚡ **RESTful API** - Clean and efficient backend architecture

---

## 🛠️ Built With

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM library
- **Passport.js** - Authentication middleware

### Frontend
- **EJS** - Template engine
- **JavaScript** - Client-side logic
- **Bootstrap** - UI framework
- **CSS3** - Custom styling

### Cloud & Tools
- **Cloudinary** - Image storage & optimization
- **MongoDB Atlas** - Cloud database
- **Render** - Application hosting
- **Git** - Version control

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Cloudinary account for image storage
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/wanderlust.git
cd wanderlust
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/wanderlust

# Session Secret
SESSION_SECRET=your-secret-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=3000
NODE_ENV=development
```

4. **Seed the database** (Optional)
```bash
node seed.js
```

5. **Start the development server**
```bash
npm start
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 📂 Project Structure

```
wanderlust/
├── models/              # Database schemas
│   ├── listing.js      # Property listing model
│   ├── user.js         # User model
│   └── review.js       # Review model
├── routes/              # Express routes
│   ├── listings.js     # Listing routes
│   ├── users.js        # Auth routes
│   └── reviews.js      # Review routes
├── controllers/         # Route controllers
│   ├── listings.js
│   ├── users.js
│   └── reviews.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication
│   └── validateListing.js
├── views/               # EJS templates
│   ├── listings/
│   ├── users/
│   └── layouts/
├── public/              # Static files
│   ├── css/
│   ├── js/
│   └── images/
├── utils/               # Utility functions
│   └── cloudinary.js
├── app.js               # App entry point
├── package.json
└── .env.example
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/signup` | Show signup form |
| POST | `/signup` | Register new user |
| GET | `/login` | Show login form |
| POST | `/login` | Authenticate user |
| GET | `/logout` | Logout user |

### Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings` | Get all listings |
| GET | `/listings/new` | Show create form |
| POST | `/listings` | Create new listing |
| GET | `/listings/:id` | Get listing by ID |
| GET | `/listings/:id/edit` | Show edit form |
| PUT | `/listings/:id` | Update listing |
| DELETE | `/listings/:id` | Delete listing |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/listings?category=Beachfront` | Filter by category |

---

## 💾 Database Models

### User Schema
```javascript
{
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  // Hashed
  createdAt: { type: Date, default: Date.now }
}
```

### Listing Schema
```javascript
{
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: String,
    filename: String
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Beachfront', 'Mountains', 'Countryside', 'Urban'] 
  },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 🌐 Deployment

### Deploy on Render

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build**
   ```
   Build Command: npm install
   Start Command: npm start
   ```

3. **Environment Variables**
   Add all variables from `.env` file in Render dashboard

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### MongoDB Atlas Setup

1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP: `0.0.0.0/0` (for Render)
4. Get connection string
5. Add to Render environment variables

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Navigate to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to environment variables

---

## 🎯 Features in Detail

### 🔐 Authentication System
- User registration with password hashing (bcrypt)
- Secure login with Passport.js local strategy
- Session management with Express Session
- Protected routes with authentication middleware

### 🏠 Listing Management
- Create listings with title, description, price, location
- Upload property images via Cloudinary
- Edit and update existing listings
- Delete listings (owner only)
- Image optimization and storage

### 🗂️ Category System
- Filter properties by category
- Categories: Beachfront, Mountains, Countryside, Urban
- Dynamic category-based rendering

### 💰 Pricing
- Base price display
- GST calculation (18%)
- Total price with taxes

---


## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

## 🚀 Future Enhancements

- [ ] Booking system with calendar
- [ ] Payment integration (Stripe/Razorpay)
- [ ] Review and rating system
- [ ] Real-time messaging
- [ ] Email notifications
- [ ] Wishlist/favorites
- [ ] Google Maps integration
- [ ] Multi-image upload per listing
- [ ] Advanced search filters
- [ ] User profiles and verification


<div align="center">

**Made with ❤️ and ☕**

⭐ **Star this repo if you found it helpful!** ⭐

</div>
