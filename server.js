const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Atlas connection (REPLACE THIS URL)
mongoose.connect("YOUR_MONGODB_ATLAS_URL", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

// ✅ User Model
const User = mongoose.model("User", {
  mobile: String,
  password: String,
  mpin: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ ROOT ROUTE (for testing)
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// ✅ LOGIN / REGISTER API
app.post("/login", async (req, res) => {
  try {
    const { mobile, password, mpin } = req.body;

    let user = await User.findOne({ mobile });

    // 👉 If user doesn't exist → create
    if (!user) {
      user = new User({ mobile, password, mpin });
      await user.save();
      return res.json({ status: "created", message: "User Registered" });
    }

    // 👉 Check credentials
    if (user.password !== password || user.mpin !== mpin) {
      return res.json({ status: "error", message: "Invalid credentials ❌" });
    }

    return res.json({ status: "success", message: "Login Successful ✅" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Server Error ❌" });
  }
});

// ✅ GET ALL USERS (ADMIN)
app.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ✅ DELETE USER (optional admin feature)
app.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed ❌" });
  }
});

// ✅ PORT (IMPORTANT FOR RENDER)
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});