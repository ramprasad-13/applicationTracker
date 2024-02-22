const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/logout',(req,res) =>{
    if (req.cookies.id && req.cookies.token){
        res.clearCookie('id')
        res.clearCookie('token')
    }
    // res.redirect('signup.html')
    res.status(200).json({msg:"LogOut Sucessfull"})
})

module.exports = router;