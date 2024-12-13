// import { authenticate } from "passport";
import { jobseekerModel } from "../../model/userModel/jobseekerModel.js";
import session from "express-session";

const getUser = async (req,res,next) =>{
  try {
    const userId = req.user.id;
    const user = await jobseekerModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'An error occurred while fetching user data' });
  }
}
const uploadCV = async (req, res, next) => {
    try {
      console.log("User", req.user)
      const userId = req.user.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const fileCVPath = req.file?.path;
      const cvName = req.body?.name;
      if (!cvName ) {
        throw new Error("Invalid request: Missing CV name");
      }
      if (!fileCVPath ) {
        throw new Error("Invalid request: Missing file");
      }
      if (req.file.mimetype !== 'application/pdf') {
        throw new Error("Invalid file type. Only PDF is allowed.");
      }
      const result = jobseekerModel.uploadCV(userId,fileCVPath,cvName)
      res.status(200).json({ message: "CV uploaded successfully", userId });
    } catch (error) {
      console.error("Error during CV upload:", error);
      res.status(500).json({ message: error.message });
    }
  };
  const deleteCV = async (req, res, next) => {
    const  cvId  = req.params.CVId; 
    const userId = req.user.id;
    console.log("CV:",cvId);
    console.log("UserId:",userId)
    try {
      const result = await jobseekerModel.deleteCV(cvId, userId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error while deleting CV:', error);
      res.status(500).json({ message: `Có lỗi xảy ra khi xóa CV: ${error.message}` });
    }
  };
  const getListCV = async (req, res, next) => {
    try {
      const userId = req.user.id;
  
      if (!userId) {
        return res.status(400).json({ message: 'userId không được cung cấp.' });
      }
  
      const userCVList = await jobseekerModel.getListCV(userId)
  
      if (!userCVList || userCVList.length === 0) {
        return res.status(200).json({ message: 'Người dùng chưa có CV nào.', CVProfile: [] });
      }
  
      res.status(200).json({ message: 'Danh sách CV.', CVProfile: userCVList });
    } catch (error) {
      next(new Error(`Có lỗi xảy ra khi lấy danh sách CV: ${error.message}`));
    }
  };
  
  
const updateListArticle = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const articleId = req.params.id;
    if (!userId || !articleId) {
      return res.status(400).json({ success: false, message: "Invalid userId or articleId" });
    }
    const result = await jobseekerModel.updateListArticle(userId, articleId);
    next();
    // if (result.success) {
    //   return res.status(200).json(result);
    // } else {
    //   return res.status(400).json(result);
    // }
  } catch (error) {
    console.error("Error during Submit:", error);
    res.status(500).json({ success: false, message: error.message || "Server Error" });
  }
};

const getListArticleApply = async (req, res, next) => {
  try {
    const userId = req.user.id;  
    const result = await jobseekerModel.getListArticleApply(userId); 
    if (result.error) {
      return res.status(500).json({ message: result.error }); 
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error: ', error);
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách bài viết.' }); 
  }
};

  const getFavouriteArticleController = async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await jobseekerModel.getFavouriteArticle(userId);
      if (result.error) {
        return res.status(500).json({ success: false, message: result.error });
      }
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getFavouriteArticleController:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
  
  const addFavouriteArticleController = async (req, res) => {
    try {
      const userId = req.user.id;
      const articleId = req.params.articleId;
  
      if (!articleId) {
        return res.status(400).json({ success: false, message: "Article ID is required." });
      }
  
      const result = await jobseekerModel.addFavouriteArticle(userId, articleId);
      if (result.error) {
        return res.status(500).json({ success: false, message: result.error });
      }
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in addFavouriteArticleController:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
  const removeFavouriteArticleController = async (req, res) => {
    try {
      const userId = req.user.id;
      const articleId = req.params.articleId;
  
      if (!articleId) {
        return res.status(400).json({ success: false, message: "Article ID is required." });
      }
  
      const result = await jobseekerModel.removeFavouriteArticle(userId, articleId);
      if (result.error) {
        return res.status(500).json({ success: false, message: result.error });
      }
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in removeFavouriteArticleController:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };
  
  export const jobseekerController = {
    uploadCV,
    deleteCV,
    getListCV,
    updateListArticle,
    getUser,
    getListArticleApply,
    getFavouriteArticleController,
    addFavouriteArticleController,
    removeFavouriteArticleController,
  }
