import mongoose from "mongoose";
import User from "../models/userSchema";
import Task from "../models/taskSchema";
import Project from "../models/projectSchema";

const MONGODB_URI = process.env.MONGO_URL || ""; 

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    mongoose.model("User", User.schema);
    mongoose.model("Task", Task.schema);
    mongoose.model("Project", Project.schema);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:" + error);
  }
};

export default connect;