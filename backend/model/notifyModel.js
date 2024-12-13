import { ObjectId } from 'mongodb';
import { client } from '../config/mongoDB.js';
const createApplicationNotificationForRecruiter = async (articleId, userId) => {
    try {
      const article = await client
        .db('RecruitmentArticledatabase')
        .collection('Article')
        .findOne({ _id: new ObjectId(articleId) });
  
      if (!article) {
        return { success: false, message: 'Article not found.' };
      }
      const user = await client
      .db('Account')
      .collection('Job Seeker')
      .findOne({ _id: new ObjectId(userId) });
      const { recruiterId, title: articleTitle } = article;
      const notification = {
        _id: new ObjectId(),
        recipientId: new ObjectId(recruiterId),
        articleId: new ObjectId(articleId),
        message: `${user.Name} đã ứng tuyển vào bài viết "${articleTitle}".`,
        timestamp: new Date(),
        isRead: false
      };
        const result = await client
        .db('NotifyDatabase') 
        .collection('Recruiter') 
        .insertOne(notification);
      return {
        success: true,
        message: 'Notification created successfully.',
        notificationId: result.insertedId
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, message: 'Failed to create notification.' };
    }
  };
//   const createApplicationNotificationForJobseeker = async (articleId, candidateName) => {
//     try {
//       const article = await client
//         .db('RecruitmentArticledatabase')
//         .collection('Article')
//         .findOne({ _id: new ObjectId(articleId) });
  
//       if (!article) {
//         return { success: false, message: 'Article not found.' };
//       }
//       const { recruiterId, title: articleTitle } = article;
//       const notification = {
//         _id: new ObjectId(),
//         recipientId: new ObjectId(recruiterId),
//         articleId: new ObjectId(articleId),
//         message: `${candidateName} đã ứng tuyển vào bài viết "${articleTitle}".`,
//         timestamp: new Date(),
//         isRead: false
//       };
//         const result = await client
//         .db('NotifyDatabase') 
//         .collection('Recruiter') 
//         .insertOne(notification);
//       return {
//         success: true,
//         message: 'Notification created successfully.',
//         notificationId: result.insertedId
//       };
//     } catch (error) {
//       console.error('Error creating notification:', error);
//       return { success: false, message: 'Failed to create notification.' };
//     }
//   };
const getNotificationsForRecruiter = async (recruiterId) => {
  try {
    const notifications = await client
      .db('NotifyDatabase')
      .collection('Recruiter') 
      .find({ recipientId: new ObjectId(recruiterId) }, { projection: { _id: 1, message: 1 } })
      .sort({ timestamp: -1 })
      .toArray();

    return { success: true, notifications };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { success: false, message: 'Failed to fetch notifications.' };
  }
};
export const notifyModel = {
    createApplicationNotificationForRecruiter,
    getNotificationsForRecruiter,
}