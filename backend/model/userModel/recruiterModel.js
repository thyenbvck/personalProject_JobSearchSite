import Joi from 'joi'
import {client} from '../../config/mongoDB.js'
import fs from 'fs';
import { articleModel } from '../articleModel.js';
import { ObjectId } from 'mongodb';

const getUser = async (id) => {
  try {
    const user = await client
      .db("Account")
      .collection("Recruiter")
      .findOne({ _id: new ObjectId(id) });
    if (!user) {
      return { error: 'User not found' };
    }
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return { error: 'An error occurred while fetching the user' };
  }
};
// const getArticleById = async (id) => {
//   try {
//     const user = await client
//       .db("Account")
//       .collection("Recruiter")
//       .findOne({ _id: new ObjectId(id) });
//     if (!user) {
//       return { error: 'User not found' };
//     }
//     return user;
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     return { error: 'An error occurred while fetching the user' };
//   }
// };
const getListCVFromArticle = async (articleId) => {
  try {
    const article = await client
      .db("RecruitmentArticledatabase")
      .collection("Article")
      .findOne({ _id: new ObjectId(articleId) });
    if (!article) {
      return { error: 'Article not found' };
    }
    const { jobseekerList } = article;
    if (!jobseekerList || !jobseekerList.list) {
      return { error: 'No jobseeker list found' };
    }
    const formattedList = jobseekerList.list.map((jobseeker) => ({
      id : jobseeker.id,
      name: jobseeker.name,
      gender: jobseeker.gender,
      gmail: jobseeker.gmail,
      status: jobseeker.status || 'No status available',
    }));
    return formattedList;
  } catch (error) {
    console.error('Error fetching user:', error);
    return { error: 'An error occurred while fetching the user' };
  }
};
const getDetailCV = async (articleId,cvId) => {
  try {
     // Tìm bài viết theo articleId
     const article = await client
     .db("RecruitmentArticledatabase")
     .collection("Article")
     .findOne({ _id: new ObjectId(articleId) });

   if (!article || !article.jobseekerList || !article.jobseekerList.list) {
     throw new Error("Article or jobseeker list not found");
   }
   const cv = article.jobseekerList.list.find((item) => item.id.toString() === cvId.toString());
   if (!cv || !cv.cvInfo || !cv.cvInfo.cvFile.data) {
     throw new Error("CV file not found");
   }
   return {
     data: cv.cvInfo.cvFile.data
   };
 } catch (error) {
   console.error("Error fetching CV from DB:", error.message);
   throw error; 
  }
};
const replyCV = async (articleId, cvId, newStatus) => {
  try {
    const result = await client
      .db("RecruitmentArticledatabase")
      .collection("Article")
      .updateOne(
        { 
          _id: new ObjectId(articleId), 
          "jobseekerList.list.id": new ObjectId(cvId)
        },
        { 
          $set: { 
            "jobseekerList.list.$.status": newStatus 
          }
        }
      );

    if (result.modifiedCount === 0) {
      throw new Error("Failed to update CV status or CV not found");
    }

    console.log("CV status updated successfully");
    return { message: "CV status updated successfully" };

  } catch (error) {
    console.error("Error updating CV status:", error);
    throw error;
  }
};
export const recruiterModel = {
  getUser,
  getListCVFromArticle,
  getDetailCV,
  replyCV
}