import User from '../models/users.model.mjs';
import jwt from 'jsonwebtoken';
import upload from '../middleware/upload.mjs';


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


export const updateUserByUsername = async (req, res) => {
  const { username } = req.params;
  const { name } = req.body;

  // Multer middleware for file uploads
  upload.single("avatar")(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const updateFields = { name };
      if (req.file) {
        const avatarUrl = `/uploads/${req.file.filename}`;
        updateFields.avatarUrl = avatarUrl;
      }

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
  });
};

