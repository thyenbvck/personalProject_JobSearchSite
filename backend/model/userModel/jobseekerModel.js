import Joi from 'joi'
import {client} from '../../config/mongoDB.js'
import fs from 'fs';
import { articleModel } from '../articleModel.js';
import { ObjectId } from 'mongodb';

const getUser = async (id) => {
  try {
    const user = await client
      .db("Account")
      .collection("Job Seeker")
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

const findUserById = async (id) => {
  try {
    const user = await client
      .db("Account")
      .collection("Job Seeker")
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


const uploadCV = async (userId, fileCVPath, cvName) => {
  if (!fs.existsSync(fileCVPath)) {
    throw new Error("File not found.");
  }
  const cvBuffer = fs.readFileSync(fileCVPath);
  const base64Data = cvBuffer.toString('base64')
  const result = await client
  .db("Account")
  .collection("Job Seeker")
  .updateOne(
    { _id: new ObjectId(userId) },
    {
      $push: {
        CVProfile: { 
          _id: new ObjectId(),
          name: cvName,
          cvFile: {
            contentType: "application/pdf",
            data: base64Data,
          },
          updatedAt: new Date(),
        },
      },
    }
  );
if (result.matchedCount === 0) {
  throw new Error("User not found");
}
return { message: "CV profile updated successfully", userId: userId };
}
const deleteCV = async (CVID,userId) =>{
  try {
    const result = await client
    .db("Account")
    .collection("Job Seeker")
    .updateOne(
      { _id: new ObjectId(userId) },  
      { $pull: { CVProfile: { _id: new ObjectId(CVID) } } }  // Xóa CV theo cvId
    );

    // Kiểm tra kết quả
    if (result.modifiedCount === 0) {
      throw new Error('Không tìm thấy CV hoặc không thể xóa.');
    }

    return { message: 'CV đã được xóa thành công.' };
  } catch (error) {
    throw new Error(`Có lỗi xảy ra: ${error.message}`);
  }
}
const getListCV = async (userId) => {
  try {
    const user = await client
      .db("Account")
      .collection("Job Seeker")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { CVProfile: 1, _id: 0 } }
      );

    if (!user || !user.CVProfile || user.CVProfile.length === 0) {
      return { message: "Không tìm thấy CV nào." };
    }

    return { 
      message: "Lấy danh sách CV thành công.", 
      data: user.CVProfile
    };
  } catch (error) {
    throw new Error(`Có lỗi xảy ra: ${error.message}`);
  }
};
const updateListArticle = async (userId, articleId) => {
  try {
    const result = await client
      .db("Account")
      .collection("Job Seeker")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { ApplyList: new ObjectId(articleId) } }
      );

    if (result.modifiedCount === 0) {
      return { success: false, message: "Article already in ApplyList" };
    }
    return { success: true, message: "Article added to ApplyList successfully" };

  } catch (error) {
    console.error("Error updating ApplyList:", error);
    throw new Error(error.message || "Failed to update ApplyList.");
  }
};
const getListArticleApply = async (userId) => {
  try {
    const jobSeeker = await client
      .db("Account")
      .collection("Job Seeker")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { ApplyList: 1, _id: 0 } }
      );
    if (!jobSeeker || !jobSeeker.ApplyList || jobSeeker.ApplyList.length === 0) {
      return { message: "No applied articles found for the user.", data: [] };
    }
    const articles = await client
      .db("RecruitmentArticledatabase")
      .collection("Article")
      .find(
        { _id: { $in: jobSeeker.ApplyList.map((id) => new ObjectId(id)) } },
        {
          projection: {
            _id: 1,
            title: 1, // Tiêu đề bài viết
            "jobseekerList.list": 1, // Danh sách ứng viên
          },
        }
      )
      .toArray();

    // Xử lý danh sách bài viết và trạng thái CV
    const result = articles.map((article) => {
      const userCV = article.jobseekerList.list.find(
        (jobseeker) => String(jobseeker.userId) === String(userId)
      );

      return {
        articleId: article._id,
        title: article.title,
        cvStatus: userCV ? userCV.status : "Unknown", // Trạng thái CV
        cvName: userCV ? userCV.cvInfo.name : "unKnow",
        submittedAt: userCV ? userCV.submittedAt : null, // Ngày nộp CV
      };
    });

    // Trả về kết quả sau khi xử lý
    return { message: "Successfully fetched articles and CV statuses.", data: result };
  } catch (error) {
    console.error("Error fetching articles for user:", error);
    // Trả về lỗi nếu có lỗi trong quá trình lấy dữ liệu
    return { error: "An error occurred while fetching the articles." };
  }
};
const getFavouriteArticle = async (userId) => {
  try {
    const user = await client
      .db("Account")
      .collection("Job Seeker")
      .findOne(
        { _id: new ObjectId(userId) },
        { projection: { favouriteList: 1, _id: 0 } }
      );
    if (!user || !user.favouriteList || user.favouriteList.length === 0) {
      return { success: true, articles: [] };
    }
    const articles = await client
      .db("RecruitmentArticledatabase")
      .collection("Article")
      .find({ _id: { $in: user.favouriteList.map(id => new ObjectId(id)) } })
      .toArray();
    return { success: true, articles };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return { error: "An error occurred while fetching the articles." };
  }
};
const addFavouriteArticle = async (userId, articleId) => {
  try {
    const result = await client
      .db("Account")
      .collection("Job Seeker")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { favouriteList: articleId } }
      );

    return result.modifiedCount > 0
      ? { success: true, message: "Article added to favourites." }
      : { success: false, message: "Article is already in favourites or user not found." };
  } catch (error) {
    console.error("Error adding article to favourites:", error);
    return { error: "An error occurred while adding the article to favourites." };
  }
};

const removeFavouriteArticle = async (userId, articleId) => {
  try {
    const result = await client
      .db("Account")
      .collection("Job Seeker")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { favouriteList: articleId } }
      );
    if (result.modifiedCount > 0) {
      return { success: true, message: "Article removed from favourites." };
    } else {
      return { success: false, message: "Article not found in favourites or user not found." };
    }
  } catch (error) {
    console.error("Error removing article from favourites:", error);
    return { error: "An error occurred while removing the article from favourites." };
  }
};

export const jobseekerModel = {
  uploadCV,
  deleteCV,
  getListCV,
  updateListArticle,
  getUser,
  findUserById,
  getListArticleApply,
  getFavouriteArticle,
  addFavouriteArticle,
  removeFavouriteArticle,
}