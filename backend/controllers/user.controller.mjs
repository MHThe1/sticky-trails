import User from '../models/users.model.mjs';
import jwt from 'jsonwebtoken';


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'});
};

// login user
export const loginUser = async (req, res) => {
    res.json({ message: 'login user' });
}

// register user
export const registerUser = async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        const user = await User.signup(name, email, username, password);

        const token = createToken(user._id);
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

