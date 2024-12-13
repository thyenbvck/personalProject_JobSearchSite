import express from 'express'
import { authenticate } from '../../middleware/authMiddleware.js';
import { adminController } from '../../controller/adminController/adminController.js';

import { uploadMiddleware } from '../../middleware/multer.js';

const adminRouter = express.Router();

adminRouter.route('/').get(authenticate, articleController.getAdmin)

//CRUD
adminRouter.route('/create').post(authenticate, adminController.addAdmin)
adminRouter.route(':id/delete').delete(authenticate, adminController.deleteAdmin)
adminRouter.route('/info').get(authenticate, adminController.getAdmin)


adminRouter.route(':userId/delete').delete(authenticate, adminController.deleteUser)
adminRouter.route(':userId/info').get(authenticate, adminController.getUser)
export default adminRouter