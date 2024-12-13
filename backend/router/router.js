import express from 'express'
import jobseekerRouter from './user/jobSeekerRouter.js';
import recruiterRouter from './user/recruiterRouter.js';
import authRouter from './authRouter.js';
const Router = express.Router();
Router.route('/')
.get(async (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Login to Your Account</h2>
        <button onclick="window.location.href='/jobseeker/auth/google'">Login JobSeeker with Google</button>
        <br/><br/>
        <button onclick="window.location.href='/recruiter/auth/google'">Login Recruiter with Google</button>
      </body>
    </html>
  `);
});
Router.use('/', authRouter);
Router.use('/jobseeker', jobseekerRouter);
Router.use('/recruiter',recruiterRouter);
export default Router