const express = require('express')
const router = express.Router()
const User = require('./connection')
const validateToken = require('./middleware')

router.post("/add",validateToken, async(req,res)=>{
  try {
    const id =req.cookies.id
    //access cookie with key id
    const user = await User.findOne({ _id: id });
    const {CompanyName,JobLink,AppliedDate,Role,Notes} = req.body

    // Create a new job application
    const newApplication = {
        CompanyName,
        JobLink,
        AppliedDate,
        Role,
        Notes,
        Status:"Applied"
    };

    if (newApplication) {
      user.jobs.push(newApplication);
      user.details.Applied=user.details.Applied + 1
    }  
    await user.save()
    res.send(user)
  } catch(err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
