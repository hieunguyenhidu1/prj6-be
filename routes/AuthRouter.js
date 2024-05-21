const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]; 
    const secretKey = 'key_hieunm'; 
  
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Không có mã thông báo'
      });
    }

    console.log(token);
    
  
    jwt.verify(token, secretKey, (err, decoded) => { 
      if (err) {
        console.log('Lỗi xác thực:', err);
        return res.status(403).json({ 
          success: false,
          message: 'Mã thông báo không hợp lệ hoặc đã hết hạn'
        });
      }
  
      console.log('Mã thông báo đã giải mã:', decoded);
      return res.status(200).json({
        success: true,
        message: 'Xác thực thành công'
      });
    });
  });
  module.exports = router;
