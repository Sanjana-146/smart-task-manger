const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 4000;

// ✅ Middleware Setup
app.use(express.json()); // Parses JSON body
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(cookieParser());

// ✅ CORS Configuration
const allowedOrigins = ['http://localhost:4000', 'http://localhost:7000'];
app.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT'],
    })
);

// ✅ Session Configuration
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/TaskManagerform-database',
            collectionName: 'sessions',
        }),
        cookie: { secure: false, httpOnly: true, sameSite: 'lax' },
    })
);

// ✅ Serve static files from "public" directory
app.use(express.static(path.join(__dirname)));

// ✅ Serve register.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// ✅ Connect to MongoDB
mongoose
    .connect('mongodb://localhost:27017/TaskManagerform-database', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ✅ Define User Schema & Model
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// ✅ Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        console.log("📥 Signup Data:", req.body);

        // Check if user already exists
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({ name, email, phone, password: hashedPassword });

        // Set session
        req.session.user = { email: newUser.email, name: newUser.name, phone: newUser.phone };

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('❌ Signup Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ✅ Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Store user in session
        req.session.user = { email: user.email, name: user.name, phone: user.phone };

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('❌ Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Logout Route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed" });
        res.clearCookie('connect.sid'); // Clear session cookie
        res.json({ message: "Logged out successfully" });
    });
});

// ✅ Get All Users (Admin Route)
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error('❌ Fetch Users Error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// ✅ Get Current User Profile
app.get('/api/users/me', async (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const user = await User.findOne({ email: req.session.user.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ name: user.name, email: user.email, phone: user.phone });
    } catch (error) {
        console.error('❌ Fetch User Profile Error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update User Profile
app.put('/api/users/update', async (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { name, phone } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: req.session.user.email },
            { name, phone },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        // Update session data
        req.session.user.name = updatedUser.name;
        req.session.user.phone = updatedUser.phone;

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error('❌ Profile Update Error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Check Authentication Status
app.get('/api/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.user, user: req.session.user || null });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});