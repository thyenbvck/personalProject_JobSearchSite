import express from 'express'
import { authenticate } from '../../middleware/authMiddleware.js';
import { jobseekerController } from "../../controller/userController/jobseekerController.js"
import { articleController } from '../../controller/articleController.js';
import { notifyController } from '../../controller/notifyController.js';
import { uploadMiddleware } from '../../middleware/multer.js';

const jobseekerRouter = express.Router();
//Login
jobseekerRouter.route('/').get(articleController.getAllArticle)
jobseekerRouter.route('/info').get(authenticate,jobseekerController.getUser)
jobseekerRouter.route('/:id').get(articleController.getDetailArticle)
jobseekerRouter.route('/:id/submitCV').post(authenticate,articleController.updateSubmitCVForArticle,jobseekerController.updateListArticle,notifyController.createApplicationNotificationForRecruiter)
//Register
jobseekerRouter.route('/info/CV').get(authenticate,jobseekerController.getListCV);
jobseekerRouter.route('/info/uploadCV').post(authenticate,uploadMiddleware,jobseekerController.uploadCV);
jobseekerRouter.route('/info/deleteCV/:CVId').delete(authenticate,jobseekerController.deleteCV);
jobseekerRouter.route('/info/listApply').get(authenticate,jobseekerController.getListArticleApply);
jobseekerRouter.route('/info/favouriteArticle').get(authenticate,jobseekerController.getFavouriteArticleController);
jobseekerRouter.route('/info/:articleId/favouriteArticle').delete(authenticate,jobseekerController.removeFavouriteArticleController);
jobseekerRouter.route('/:articleId/favouriteArticle').post(authenticate,jobseekerController.addFavouriteArticleController);
export default jobseekerRouter