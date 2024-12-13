import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from './passport.js'; 
import cookieParser from 'cookie-parser';
import Router from '../backend/router/router.js';
import { connectDB } from './config/mongoDB.js';
connectDB();
const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
};
app.use(cors(corsOptions)); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: true,
  cookie: { 
    httpOnly: false, 
    secure: false,  
    maxAge: 72000000,
       
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/',Router);
// simple route
// app.get('/', (req, res) => {
//   console.log("Route /a was accessed");
//   res.send("<a href='auth/google'>Login with Google </a>");
// });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});