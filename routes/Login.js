const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const userModel= require('./connection')
const jwt = require('jsonwebtoken');
const path = require('path')

router.get('/login',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname, '../public', 'login.html'));
})

router.post('/login', async (req, res) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (user == null) {
        return res.status(400).json({"Error":'User Not Found'});
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // const accessToken = jwt.sign(user.toJSON(),'secret'); //process.env.ACCESS_TOKEN_SECRET
            // res.json({ accessToken: accessToken });

            const accessToken = jwt.sign(user.toJSON(), 'secret'); //process.env.ACCESS_TOKEN_SECRET
            res.cookie('token', accessToken, { httpOnly: true , SameSite: 'None', Secure: true }); // set cookie here
            res.cookie('id',user._id,{ SameSite: 'None', Secure: true }) //seting user id
            res.status(200).redirect('/');
        } else {
            res.status(401).json({"Error":"Wrong Password"});
        }
    } catch {
        res.status(500).json({"Error":"Internal Server Error"});
    }
});

module.exports = router;