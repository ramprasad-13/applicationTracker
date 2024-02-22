const express = require('express')
const router = express.Router()
const User = require('./connection')
const validateToken = require('./middleware')

router.patch('/update', validateToken, async (req, res) => {
  try {
    const id = req.cookies.id;
    const { job_id, updateStatus, updateNotes } = req.query;
    // First, find the current job status
    const user = await User.findOne({ _id: id})
    const job = user.jobs.find(job => job._id.toString() === job_id);
    const currentStatus = job.Status

    if(updateNotes!=""){
          // Then, update the job's status and notes
          await User.findOneAndUpdate(
            { _id: id, 'jobs._id': job_id },
            {
            $set: {
                'jobs.$.Notes': updateNotes
            }
          },
          { new: true }
        )
      }

      if(updateStatus!=""){
        // Then, update the job's status and notes
        await User.findOneAndUpdate(
          { _id: id, 'jobs._id': job_id },
          {
          $set: {
              'jobs.$.Status': updateStatus
          }
        },
        { new: true }
      )
      const userAfterUpdate = await User.findById(id);
      userAfterUpdate.details[currentStatus] = userAfterUpdate.details[currentStatus] - 1;
      userAfterUpdate.details[updateStatus] = userAfterUpdate.details[updateStatus] + 1;
      await userAfterUpdate.save();
    }

    res.status(200).json({"success":"update successful"});
  } catch (err) {
    res.json({ message: err });
  }
});





module.exports = router;
