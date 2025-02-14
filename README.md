# Blog Backend

This is the backend service for the **Blog Project**, built using **Node.js, Express, TypeScript, and MongoDB**.  
It provides **authentication, user management, post creation, file uploads, and more**.

## 🚀 Features

- **User Authentication** (JWT-based)
- **CRUD Operations for Posts**
- **File Uploads with Multer**
- **Middleware for Authentication & Authorization**
- **Standardized API Responses**
- **MongoDB Database with Mongoose ORM**
- **Docker Support for Containerization**
- **Secure API with Error Handling**

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/arvinzaferani/blog-back-end.git
cd blog-back-end
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a **`.env`** file in the root directory and add:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
UPLOADS_FOLDER=uploads/
```

### 4️⃣ Run the Server
```bash
npm run dev
```
Server will start at **`http://localhost:5000`**.

---

## 🚀 Running with Docker

### 1️⃣ Build Docker Image
```bash
docker build -t blog-backend .
```

### 2️⃣ Run Docker Container
```bash
docker run -p 5000:5000 blog-backend
```

---

## 📖 API Endpoints

### **Auth Routes**
| Method | Endpoint      | Description             |
|--------|-------------|-------------------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and get JWT token |

### **User Routes**
| Method | Endpoint       | Description                  |
|--------|---------------|------------------------------|
| `GET`  | `/users`      | Get current user info       |
| `PUT`  | `/users`      | Update user profile         |

### **Post Routes**
| Method | Endpoint          | Description                    |
|--------|------------------|--------------------------------|
| `POST` | `/posts`        | Create a new post             |
| `GET`  | `/posts`        | Get all posts                 |
| `GET`  | `/posts/:id`    | Get a single post by ID       |
| `PUT`  | `/posts/:id`    | Update a post                 |
| `DELETE` | `/posts/:id`  | Delete a post                 |

### **File Upload Route**
| Method | Endpoint          | Description            |
|--------|------------------|------------------------|
| `POST` | `/upload`        | Upload a file         |

---

## 🛠 Technologies Used
- **Node.js & Express.js** - Backend framework
- **TypeScript** - Type safety
- **MongoDB & Mongoose** - Database & ORM
- **JWT (JSON Web Tokens)** - Authentication
- **Multer** - File uploads
- **Docker** - Containerization

---

## 🎯 Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repo
2. Create a new branch (`feature-new`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to your branch (`git push origin feature-new`)
5. Open a pull request

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🌎 Contact
📧 **Email:** [arzaferani@gmail.com](mailto:arzaferani@gmail.com)  
🔗 **GitHub:** [arvinzaferani](https://github.com/arvinzaferani)  
