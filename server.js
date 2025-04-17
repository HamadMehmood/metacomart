const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection (Replace with your actual credentials)
mongoose.connect("mongodb+srv://metaco_admin:<admin123>@cluster0.muy9mqq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ✅ Models
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String,
  discount: Number,
  stock: Number
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  userId: String,
  items: Array,
  total: Number,
  date: String
}));

// ✅ Middleware for auth
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// ✅ Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: 'Registered successfully' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/api/order', authenticate, async (req, res) => {
  const { items, total } = req.body;
  const order = new Order({
    userId: req.userId,
    items,
    total,
    date: new Date().toLocaleString()
  });
  await order.save();
  res.json({ message: 'Order placed' });
});

app.get('/api/orders', authenticate, async (req, res) => {
  const orders = await Order.find({ userId: req.userId });
  res.json(orders);
});

app.post('/api/contact', (req, res) => {
  res.json({ message: 'Contact form submitted!' });
});

app.post('/api/coupon', (req, res) => {
  const { code } = req.body;
  if (code === 'DISCOUNT10') {
    return res.json({ discount: 10 });
  }
  res.json({ discount: 0 });
});

// ✅ Health Check Route for Render
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// POST /api/change-password
app.post("/api/change-password", authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: "Password updated successfully. Please log in again." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
