const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const userModel= require('./connection')
const jwt = require('jsonwebtoken');
const path = require('path')

router.get('/register',(req,res) =>{
    if (req.cookies.id && req.cookies.token){
        res.clearCookie('id')
        res.clearCookie('token')
    }
    // res.redirect('signup.html')
    res.sendFile(path.join(__dirname, '../public', 'signup.html'));
})

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new userModel({ ...req.body, password:hashedPassword, details:{
            name:req.body.username,
            Applied:0,
            Processing:0,
            Rejected:0
        },jobs:[]});
        await newUser.save();
        res.status(201).json({"Success":"User Created Successfully"})
    } catch {
        res.status(500).send('Error Registering User');
    }
});

module.exports = router;