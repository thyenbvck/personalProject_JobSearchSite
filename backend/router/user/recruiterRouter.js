import express from 'express'
import { authenticate } from '../../middleware/authMiddleware.js';
import { recruiterController } from "../../controller/userController/recruiterController.js"
import { articleController } from '../../controller/articleController.js';
import { notifyController } from '../../controller/notifyController.js';
import { uploadMiddleware } from '../../middleware/multer.js';
const recruiterRouter = express.Router();
recruiterRouter.route('/').get(authenticate,articleController.getArticlesByRecruiterId)
//CRUD
recruiterRouter.route('/create').post(authenticate,articleController.createJobApplication)
recruiterRouter.route('/:id/update').put(authenticate,articleController.updateJobApplication)
recruiterRouter.route('/:id/delete').delete(authenticate,articleController.deleteJobApplication)
recruiterRouter.route('/:id').get(authenticate,articleController.getDetailArticle)
recruiterRouter.route('/:id/listCV').get(authenticate,recruiterController.getListCVFromArticle)
recruiterRouter.route('/:articleId/listCV/:cvId').get(authenticate,recruiterController.getDetailCV)
recruiterRouter.route('/:articleId/listCV/:cvId/reply').put(authenticate,recruiterController.replyCV)
recruiterRouter.route('/info').get(authenticate,recruiterController.getUser)
recruiterRouter.route('/info/notify').get(authenticate,notifyController.getNotificationsForRecruiter)
export default recruiterRouter