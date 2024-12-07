import User from '../models/users.model.mjs';
import jwt from 'jsonwebtoken';


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

