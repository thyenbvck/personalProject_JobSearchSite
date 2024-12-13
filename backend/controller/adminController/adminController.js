import { adminModel } from "../../model/adminModel.js";
import session from "express-session";
import fs from "fs";
import path from "path";
import { ObjectId } from "mongodb";

const getAdmin = async (req,res,next) =>{
    try {
      const adminId = req.body.id;
      const admin = await adminModel.getAdminById(adminId);
      if (!admin) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.status(200).json({ message: 'Admin found!', data: admin });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      res.status(500).json({ message: 'An error occurred while fetching admin data' });
    }
}

const addAdmin = async (req, res, next) => {
    try {
      const newAdmin = await adminModel.addAdmin(req.body);
      res.status(201).send(newAdmin)
    } catch (err) {
      console.error("Error adding new admin: ", err);
      res.status(500).json({ message: 'An error occurred while adding new admin' });
    }
}
    
const deleteAdmin = async (req, res, next) => {
    try {
      const adminID = req.body.id;

      if (!ObjectId.isValid(adminID)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const delResult = await adminModel.deleteAdmin(req.body.id);
      res.status(200).send(delResult)
    } catch (err) {
      console.error("Error deleting admin: ", err);
      res.status(500).json({ message: 'An error occurred while deleting an admin' });
    }
}


const fetchUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;

    if (userType != "Job Seeker" && userType != "Recruiter") {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await adminModel.fetchUser(userId, userType);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found!", data: user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;

    if (userType != "Job Seeker" && userType != "Recruiter") {
      return res.status(400).json({ message: "Invalid user type" });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const delResult = await adminModel.deleteUser(userId, userType);
    res.status(200).send(delResult)

  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "An error occurred while deleting an admin" });
  }
};

export const adminController = {
    addAdmin,
    getAdmin,
    deleteAdmin,
    fetchUser,
    deleteUser,
}