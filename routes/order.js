// routes/order.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // Assuming you have a Product model

// POST /api/order - reduce stock on purchase
router.post("/", async (req, res) => {
  try {
    const items = req.body.items;

    for (const item of items) {
      await Product.updateOne(
        { name: item.name },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.json({ message: "Stock updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Stock update failed." });
  }
});

module.exports = router;
