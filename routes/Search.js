const express = require('express')
const router = express.Router()
const User = require('./connection')
const validateToken = require('./middleware')

router.get("/search", validateToken, async(req, res) => {
  try {
        const id =req.cookies.id
        //access cookie with key id
        const user = await User.findOne({ _id: id });
        const {companyname,jobrole} = req.query
        let companyName = new RegExp(companyname, 'i');
        let role = new RegExp(jobrole, 'i');
        let jobs = user.jobs.filter(job => job.CompanyName.match(companyName) || job.Role.match(role));
        res.status(200).send(jobs);

  } catch (err) {
    console.log(err);
    res.status(500).send("Error retrieving user");
  }
})

module.exports = router;

