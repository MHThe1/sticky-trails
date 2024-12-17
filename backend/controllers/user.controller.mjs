import User from '../models/users.model.mjs';
import jwt from 'jsonwebtoken';
import multer from "multer";
import cloudinary from '../config/cloudinary.mjs';


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
};

// login user
export const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.login(identifier, password);
        const token = createToken(user._id);
        res.status(200).json({ email: user.email, username: user.username, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// register user
export const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        const user = await User.signup(name, email, username, password);

        const token = createToken(user._id);
        res.status(200).json({ email: user.email, username: user.username, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select('-password'); // Exclude password for security
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
};


// Multer setup
const upload = multer({ storage: multer.memoryStorage() }); // Temporary memory storage

export const updateUserByUsername = async (req, res) => {
  const { username } = req.params;
  const { name } = req.body;

  try {
    let avatarUrl = null;

    // Process the image upload
    if (req.file) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_images" },
          (error, result) => {
            if (error) reject(error); // Handle upload errors
            else resolve(result.secure_url); // Resolve with Cloudinary URL
          }
        );

        // Pipe the file buffer to the Cloudinary upload stream
        stream.end(req.file.buffer);
      });

      avatarUrl = await uploadPromise; // Wait for upload to complete
    }

    // Update user fields
    const updateFields = { name };
    if (avatarUrl) updateFields.avatarUrl = avatarUrl;

    const user = await User.findOneAndUpdate(
      { username },
      updateFields,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating user data" });
  }
};
