import express from 'express'
import passport from "../passport.js"
import { authenticate } from '../middleware/authMiddleware.js';
// import { userValidation } from '../validations/userValidation.js'
import { authController } from '../controller/authController.js';
const authRouter = express.Router();
// Login with Google jobseeker
authRouter.get('/jobseeker/auth/google', passport.authenticate('jobseeker-google', { scope: ['profile', 'email'] }));
authRouter.get('/jobseeker/auth/google/callback',
    passport.authenticate('jobseeker-google', {
        successRedirect: '/jobseeker/auth/google/callback/success',
        failureRedirect: '/jobseeker/auth/google/callback/failure'
}));
authRouter.get('/jobseeker/auth/google/callback/success', authController.googleAuthCallbackJobseeker);
authRouter.get('/jobseeker/auth/google/callback/failure', authController.googleAuthCallbackJobseeker);

// Login with Google recruiter
authRouter.get('/recruiter/auth/google', passport.authenticate('recruiter-google', { scope: ['profile', 'email'] }));
authRouter.get('/recruiter/auth/google/callback',
    passport.authenticate('recruiter-google', {
        successRedirect: '/recruiter/auth/google/callback/success',
        failureRedirect: '/recruiter/auth/google/callback/failure'
}));
authRouter.get('/recruiter/auth/google/callback/success', authController.googleAuthCallbackRecruiter);
authRouter.get('/recruiter/auth/google/callback/failure', authController.googleAuthCallbackRecruiter);
//Login
authRouter.route('/jobseeker/login').post(authController.signInWithJobseeker);
//Register
authRouter.route('/jobseeker/register').post(authController.signUpWithJobseeker);
authRouter.route('/jobseeker/logout').post(authController.logOut);
// authRouter.route('/').get(articleModel.getAllArticle)
authRouter.route('/recruiter/login').post(authController.signInWithRecruiter);
authRouter.route('/recruiter/register').post(authController.signUpWithRecruiter);
authRouter.route('/recruiter/logout').post(authController.logOut);

//operation
export default authRouter