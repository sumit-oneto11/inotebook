const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');

const jwt_secret = "Hell@how@reyou";
// Route-01 create a user using Post No Login Required...
router.post(
  "/createUser",
  body("email","Enter a valid email!").isEmail(),
  body("name","Enter a valid name!").isLength({ min: 3 }),
  body("password","Password must be atleast 5 character!").isLength({ min: 5 }),
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    // if there are error return Bad request and error
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {   

    let user = await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({success, error: "Email already exits!"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

     user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id:user.id
        }
      }
      
      const authToken = jwt.sign(data, jwt_secret);
      success = true;
      res.json({success, authToken});
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured!");
    }

  }
);

// Route-02 Authenticate user using Post No Login Required...
router.post(
  "/login",
  body("email","Enter a valid email!").isEmail(),
  body("password","Password can't be blank!").exists(),
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);

    // if there are error return Bad request and error
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    const {email, password} = req.body;
    try {   

    let user = await User.findOne({email: email});

        if(!user){
            return res.status(400).json({success,error: "Please login with valid credentials..."});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if(!passwordCompare){
          return res.status(400).json({success,error: "Please login with valid credentials!"});
      }

      const data = {
        user: {
          id:user.id
        }
      }

      const authToken = jwt.sign(data, jwt_secret);
      success = true;
      res.json({success,authToken});
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured!");
    }

  }
);

// Route-03 Get user details Login Required...
router.post("/getuser", fetchuser, async (req, res) => {

    try {   
       userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send({user});
    }
    catch(error){
      console.error(error.message);
      res.status(500).send("Some error occured!");
    }

  }
);

module.exports = router;
