const express= require('express')
const jwt = require('jsonwebtoken');
const path = require('path')
// Middleware to validate JWT
const validateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
    //   return res.status(401).send('Access Denied');
    return res.status(401).redirect('/login');
    
    }
  
    try {
      const verified = jwt.verify(token, 'secret'); // Replace 'secret' with your secret key
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).send('Invalid Token');
    }
  };

  module.exports = validateToken;