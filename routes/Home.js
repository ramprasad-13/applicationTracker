const express = require('express')
const router = express.Router()
const User = require('./connection')
const validateToken = require('./middleware')
const path = require('path')

router.get("/",validateToken, async(req,res)=>{
  try {
    const id =req.cookies.id
    //access cookie with key id
    const user = await User.findOne({ _id: id });
    res.status(200).sendFile(path.join(__dirname, '../public', 'home.html'));
  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving user");
  }
})

module.exports = router;