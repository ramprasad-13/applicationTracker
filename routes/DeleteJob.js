const express = require('express')
const router = express.Router()
const User = require('./connection')
const validateToken = require('./middleware')


router.get("/delete/:id", validateToken, async(req, res) => {
  try {
    const id = req.cookies.id;
    const user = await User.findOne({ _id: id });
    const job_id = req.params.id;
    if(job_id){
      
      let application=user.jobs.filter((job)=>{return job._id==job_id})
      let status=application[0].Status
      user.details[status]=user.details[status]-1
      user.jobs=user.jobs.filter((job)=>{return job._id!=job_id})
      await user.save()
      res.status(200).json({"success":"Application deleted successfully"})
    }
    else{
      res.status(200).json({"message":"Application Not found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while deleting job application');
  }
});

module.exports = router;
