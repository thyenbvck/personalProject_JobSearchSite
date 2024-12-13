import Joi from 'joi'
import { client } from '../config/mongoDB.js';
// import fs from 'fs';
// import { articleModel } from '../articleModel.js';
const signUpJobseekerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  cccd: Joi.string().required(),
  gender: Joi.string().valid("Nam", "Nữ").required(),
  birthday: Joi.date().required(),
  address: Joi.string().required(),
  location: Joi.string().required(),
  workingMethods: Joi.array().items(Joi.string()).required(),
  fields: Joi.array().items(Joi.string()).required(),
});
const signInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
// const applyForm = Joi.object(
//   {
//     _id: Joi.string().required(),
//     name: Joi.string().required(),
//     CV: Joi.string().required()
//   }
// )
//LoginModel User
const signUpWithJobseeker = async (data) => {
  try {
    const { error } = signUpJobseekerSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const existingUser = await client
      .db("Account")
      .collection("Job Seeker")
      .findOne({ email: data.email });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    const newUser = {
      email: data.email,
      password: data.password,
      name: data.name,
      cccd: data.cccd,
      gender: data.gender,
      birthday: data.birthday,
      address: data.address,
      location: data.location,
      workingMethods: data.workingMethods,
      fields: data.fields,
      createdAt: new Date(),
      CVProfile: [],
      ApplyList: [],
      favouriteList: [],
      role: "Jobseeker",
    };
    const result = await client
      .db("Account")
      .collection("Job Seeker")
      .insertOne(newUser);

      return { ...newUser, _id: result.insertedId };
    } catch (error) {
    throw new Error(error.message || "Error during sign up");
  }
};

const signInWithJobseeker = async (data) => {
  try {
    const { error } = signInSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const user = await client.db("Account").collection("Job Seeker").findOne({ email: data.email });
    console.log(user);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    // const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (data.password != user.password) {
        throw new Error("Invalid email or password");
    }
    return user;
  } catch (error) {
    throw new Error(error.message || "Error during sign in");
  }
};
const signUpWithRecruiter = async (data) => {
};

const signInWithRecruiter = async (data) => {
  try {
    const { error } = signInSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const user = await client.db("Account").collection("Recruiter").findOne({ email: data.email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    // const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (data.password != user.password) {
        throw new Error("Invalid email or password");
    }
    return user;
  } catch (error) {
    throw new Error(error.message || "Error during sign in");
  }
};
const signInWithGoogleJobSeeker = async (profile) => {
  const account = client.db("Account").collection("Job Seeker");
  const result = await account.findOne({ email: profile.email });
  return result;
}

const signInWithGoogleRecruiter = async (profile) => {
  const account = client.db("Account").collection("Recruiter");
  const result = await account.findOne({ email: profile.email });
  return result;
}

const logout = async => {

}

export const authModel = {
    signUpWithJobseeker,
    signInWithJobseeker,
    signUpWithRecruiter,
    signInWithRecruiter,
    signInWithGoogleJobSeeker,
    signInWithGoogleRecruiter,
    logout,

}