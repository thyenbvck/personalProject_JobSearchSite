import Joi from 'joi'
import {client} from '../../config/mongoDB.js'
import fs from 'fs';
import { articleModel } from '../articleModel.js';
import { ObjectId } from 'mongodb';

const newAdminSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().min(3).required(),
    firstName: Joi.string().min(1).required(),
    middleName: Joi.string(),
    lastName: Joi.string().min(1).required(),
    dateOfBirth: Joi.date().required(),
    address: Joi.string().required(),
  });


  const addAdmin = async (data) => {
    try {
   const { error } = newAdminSchema.validate(data);
      if (error) {
        throw new Error(error.details[0].message);
      }
      const existingAdmin = await client.db("Account").collection("Admin").findOne({ email: data.email });
      if (existingAdmin) {
        throw new Error("Admin with this email already exists");
      }
      const newAdmin = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        isHighRank: false,
        createdAt: new Date(),
        role: 'Admin',
      };
      const result = await client.db("Account").collection("Admin").insertOne(newAdmin);
      return result.ops[0];
    } catch (error) {
      throw new Error(error.message || "Error during addition of new admin");
    }
  };

const getAdminById = async (id) => {
  try {
    const admin = await client
      .db("Account")
      .collection("Admin")
      .findOne({ _id: new ObjectId(id) });
    if (!admin) {
      return { error: 'Account not found' };
    }
    return admin;
  } catch (error) {
    console.error('Error fetching account:', error);
    return { error: 'An error occurred while fetching the account' };
  }
};


const deleteAdmin = async (userId) => {
  try {
    const admin = await client
      .db("Account")
      .collection("Admin")
      .findOne({ _id: new ObjectId(userId) });

    if (!admin) {
        return { error: 'Account not found' };
    }
    if (admin.isHighRank == true) {
        return { error: 'Action not permitted'};
    }

    const result = await client.db("Account").collection("Admin").deleteOne(admin);
    return result.ops[0];
  } catch (error) {
    console.error("Error deleting admin:", error);
    return { error: "An error occurred while deleting an admin." };
  }
};

//userType nhận giá trị "Job Seeker" hoặc "Recruiter"
const fetchUser = async (id, userType) => {
  try {
    if (userType != "Job Seeker" && userType != "Recruiter") {
      return { error: 'Invalid user type' };
    }

    const user = await client
      .db("Account")
      .collection(userType)
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

const deleteUser = async (userId, userType) => {
  try {
    const user = await client
      .db("Account")
      .collection(userType)
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
        return { error: 'User not found' };
    }

    const result = await client.db("Account").collection(userType).deleteOne(user);
    return result.ops[0];
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "An error occurred while deleting a user." };
  }
};

export const jobseekerModel = {
    addAdmin,
    getAdminById,
    deleteAdmin,
    fetchUser,
    deleteUser,
  }