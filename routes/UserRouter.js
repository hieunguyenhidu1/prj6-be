const express = require("express");
const UserModel = require("../db/userModel");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Route handler for /user/list
router.get("/", async (req, res) => {
  try {
    // Query database to get list of users with specified fields
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Query database to get user by ID with specified fields
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/createUser", async (req, res) => {
    try {
        const newUserData = req.body;
    
        const newUser = new UserModel(newUserData);
        newUser.password = await bcrypt.hash(newUser.password,14);
        const savedUser = await newUser.save();
    
        res.status(200).json(savedUser);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/update", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
    
        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
          new: true,
        });
    
        res.status(200).json(updatedUser);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
});
  
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Sai tên đăng nhập hoặc mật khẩu" });
    }

    const userId = user._id;
    const secretKey = "key_hieunm";
    const expiresIn = "1h";

    const token = jwt.sign({ userId }, secretKey, { expiresIn }); // Tạo token
    console.log(token)
    console.log("hello")
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

router.delete("/delete", async(req,res)=>{
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndRemove(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;
