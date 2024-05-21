const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const jwt = require("jsonwebtoken");


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Query database to get photos of a user by user ID
    const photos = await Photo.find({ user_id: id });
    if (!photos) {
      return res.status(404).json({ message: "Photos not found" });
    }
    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//tinh tong so anh cua user va so comment cua cac anh do
router.get("/getCountPT/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const photoCount = await Photo.countDocuments({ user_id: id });
    
    const photos = await Photo.find({ user_id: id });
    const totalComments = photos.reduce((total, photo) => {
      if (photo.comments) {
        return total + photo.comments.length;
      } else {
        return total;
      }
    }, 0);
    res.status(200).json({ count: photoCount, totalComments: totalComments });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/photo", async (req, res) => {
  try {
    if (!req.files || !req.files.photo) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const uploadedFile = req.files.photo[0];

    const newPhoto = new PhotoModel({
      file_name: uploadedFile.path,
      user_id: req.body.userId,
      date_time: Date.now(),
    });
    const savedPhoto = await newPhoto.save();
    return res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: savedPhoto,
      photo_id: savedPhoto._id
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/comment", async (req, res) => {
  try {
    const { photoId, comment } = req.body;
    console.log("write comments")
    console.log(photoId)

    const photo123 = await Photo.findOne({ _id: photoId });
    const newComment = {
      comment: comment,
    };
    photo123?.comments?.push(newComment);
    const updatedPhoto = await photo123.save();
    res.status(200).json({ success: true, photo: updatedPhoto });

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
