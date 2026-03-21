const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ezpay");

const User = mongoose.model("User", {
  mobile: String,
  password: String,
  mpin: String
});

// 🚀 API route
app.post("/login", async (req, res) => {
  const { mobile, password, mpin } = req.body;

  let user = await User.findOne({ mobile });

  if (!user) {
    // create new user
    user = new User({ mobile, password, mpin });
    await user.save();
    return res.json({ status: "created" });
  }

  return res.json({ status: "success" });
});

// 🟢 Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});