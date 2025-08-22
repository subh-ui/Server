// Importing express and mongoose libraries
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // To connect Backend to Frontend, stands for 'Cross Origin Resource Sharing'
const bcrypt = require("bcrypt"); // To hash passwords
const dotenv = require("dotenv");
const UserModel = require("./Model/user");

dotenv.config();
const app = express(); // Initialise express
app.use(express.json());
app.use(cors());

// Connect Node JS to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
// Sign Up Logic
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(name + " " + email + " " + password);
    const existingUser = await UserModel.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exsists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Logic
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        res.json("Success");
      } else {
        res.status(401).json("Password does not match!");
      }
    } else {
      res.status(401).json("No records found!");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
