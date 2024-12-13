// import { authenticate } from "passport";
import { authModel } from "../model/authModel.js";
import session from "express-session";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
const signUpWithJobseeker = async (req, res, next) => {
    try {
      const newUser = await authModel.signUpWithJobseeker(req.body);
      console.log("newUser",newUser)
    const token = jwt.sign(
        { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role },
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } 
    );
    console.log("token after:",token);
    res.cookie('token', token, {
      httpOnly: false,  
      secure: false,
      maxAge: 3600000,
    });
    req.user = newUser;
    console.log("cookie after",req.cookies);
    res.status(201).json({ message: 'User created successfully', user: newUser })
    }  catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
const signInWithJobseeker = async (req, res, next) => {
      try {
        const user = await authModel.signInWithJobseeker(req.body);
        if (!user) {
          return res.status(401).send({ message: "Invalid email or password" });
        }
      const token = jwt.sign(
          { id: user._id, email: user.email, name: user.Name, role: user.role },
          process.env.JWT_SECRET, 
          { expiresIn: '1h' } 
      );
      res.cookie('token', token, {
        httpOnly: false,  
        secure: false,
        maxAge: 3600000,
      });
      console.log('cookies after login:', req.cookies.token);
      console.log("Cookies received: ", req.cookies);
      res.status(200).send({
        message: "Login successful"
      });
      } catch (e) {
        console.error("Error during sign in:", e);
        res.status(500).send({ message: "An error occurred during sign in" });
      }
    };
    const signUpWithRecruiter = async (req, res, next) => {
      try {
        const newUser = await authModel.signUpWithRecruiter(req.body);
        console.log("newUser",newUser)
      const token = jwt.sign(
          { id: newUser._id, email: newUser.email, name: newUser.name, role: newUser.role },
          process.env.JWT_SECRET, 
          { expiresIn: '1h' } 
      );
      console.log("token after:",token);
      res.cookie('token', token, {
        httpOnly: false,  
        secure: false,
        maxAge: 3600000,
      });
      req.user = newUser;
      console.log("cookie after",req.cookies);
      res.status(201).json({ message: 'User created successfully', user: newUser })
      }  catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  const signInWithRecruiter = async (req, res, next) => {
        try {
          const user = await authModel.signInWithRecruiter(req.body);
          if (!user) {
            return res.status(401).send({ message: "Invalid email or password" });
          }
        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.Name, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );
        res.cookie('token', token, {
          httpOnly: false,  
          secure: false,
          maxAge: 3600000,
        });
        console.log('cookies after login:', req.cookies.token);
        console.log("Cookies received: ", req.cookies);
        res.status(200).send({
          message: "Login successful"
        });
        } catch (e) {
          console.error("Error during sign in:", e);
          res.status(500).send({ message: "An error occurred during sign in" });
        }
      };
const googleAuthCallbackJobseeker = async (req, res) => {
    try {
      if (!req.user) {
        console.error('User not found during Google auth callback');
        return res.redirect('http://localhost:5173/jobseeker/register');
    }
        console.log('Request User:', req.user); 
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, name: req.user.Name, role:req.user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );
        console.log(token);
        res.cookie('token', token, {
          httpOnly: false,  
          secure: false,
          maxAge: 3600000,
        });
        console.log('cookies after login:', req.cookies.token);
        console.log('cookies token:', req.cookies);
        res.redirect('http://localhost:5173');
    } catch (error) {
        console.error('Error during Google auth callback:', error); 
        res.send('lỗi');
    }
  }; 
  const googleAuthCallbackRecruiter = async (req, res) => {
    try {
      if (!req.user) {
        console.error('User not found during Google auth callback');
        return res.redirect('http://localhost:5173/recruiter/register');
    }
        console.log('Request User:', req.user); 
        const token = jwt.sign(
            { id: req.user._id, email: req.user.email, name: req.user.Name, role: req.user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } 
        );
        res.cookie('token', token, {
          httpOnly: false,  
          secure: false,
          maxAge: 3600000,
        });
        console.log('cookies after login:', req.cookies.token);
        console.log("Cookies received: ", req.cookies);
        res.redirect('http://localhost:5173')
    } catch (error) {
        console.error('Error during Google auth callback:', error); 
        res.send('lỗi');
    }
  }; 
const authFailure = (req, res) => {
  res.send("Không truy xuất được thông tin người dùng");
};
const logOut = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: false,  
      secure: false,  
      path: '/', 
    });
    res.clearCookie('connect.sid', {
      path: '/',
      secure: false,
      httpOnly: false,
    });
    console.log("Cookies after clear:", req.cookies);
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send({ message: 'An error occurred while logging out' });
  }
};
export const authController = {
    signUpWithJobseeker,
    signInWithJobseeker,
    signUpWithRecruiter,
    signInWithRecruiter,
    googleAuthCallbackJobseeker,
    googleAuthCallbackRecruiter,
    authFailure,
    logOut,
}