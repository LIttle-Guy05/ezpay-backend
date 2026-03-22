const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.post("/login", (req, res) => {
  const { mobile, password, mpin } = req.body;

  console.log(mobile, password, mpin);

  res.json({ status: "success" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running 🚀");
});