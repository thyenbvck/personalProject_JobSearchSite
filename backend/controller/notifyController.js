import { notifyModel } from "../model/notifyModel.js";
const createApplicationNotificationForRecruiter = async (req, res) => {
    try {
      const articleId = req.params;
      const userId = req.user.id;
      if (!articleId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Article ID and candidate name are required.',
        });
      }
      const result = await notifyModel.createApplicationNotificationForRecruiter(articleId, userId);
      if (!result.success) {
        return res.status(404).json(result);
      }
  
      return res.status(201).json(result);
    } catch (error) {
      console.error('Error in createRecruiterNotification controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  };
  const getNotificationsForRecruiter = async (req, res) => {
    try {
      const recruiterId = req.params.recruiterId;
      if (!recruiterId) {
        return res.status(400).json({
          success: false,
          message: 'Recruiter ID is required.',
        });
      }
      const result = await getNotificationsForRecruiter(recruiterId);
  
      if (!result.success) {
        return res.status(404).json(result);
      }
  
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getRecruiterNotifications controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error.',
      });
    }
  };
  export const notifyController ={
    createApplicationNotificationForRecruiter,
    getNotificationsForRecruiter,
  }