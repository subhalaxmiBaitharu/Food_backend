const express = require("express");
const router = express.Router();
const Photos = require("../schemas/photo.schema");
const env = require("dotenv");
env.config();

router.get('/getPhotos', (req, res) => {
    try{
        Photos.find({}).then(data => {
            console.log(data);
            res.json(data);
        }).catch(error => {
            res.status(408).json({ error })
        })
    }catch(error){
        res.json({error})
    }
})


router.get('/getLoginPhoto', async (req, res) => {
  try {
    const photo = await Photos.findOne({ name: 'login photo' });

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json(photo);
  } catch (err) {
    console.error('Error fetching photo:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
