import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

// static signup method
userSchema.statics.signup = async function(name, email, username, password) {

  // validate input
  if (!name || !email || !username || !password) {
    throw new Error("Missing required fields");
  }
  if (!validator.isLength(name, { min: 1, max: 100 })) {
    throw new Error("Name must be between 1 and 100 characters");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isLength(username, { min: 1, max: 20 })) {
    throw new Error("Username must be between 1 and 20 characters");
  }
  if (!validator.isLength(password, { min: 6, max: 100 })) {
    throw new Error("Password must be between 6 and 100 characters");
  }

  const usernameExists = await this.findOne({ username });
  const emailExists = await this.findOne({ email });

  if (usernameExists) {
    throw new Error("Username already in use");
  }
  if (emailExists) {
    throw new Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  return user;

};


// static login method
userSchema.statics.login = async function(identifier, password) {
  
  // validate input
  if (!identifier || !password) {
    throw new Error("Missing required fields");
  }

  // Determine identity type
  const isEmail = validator.isEmail(identifier);
  const user = isEmail
    ? await this.findOne({ email: identifier })
    : await this.findOne({ username: identifier });

  if (!user) {
    throw new Error("Invalid email or username");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Incorrect password");
  }

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;