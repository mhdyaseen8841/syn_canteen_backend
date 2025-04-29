import jwt from "jsonwebtoken";

const generateAccessToken = (user_id,display_name) => {
    return jwt.sign({user:{user_id,display_name}}, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '10d'
    });
};

const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '10d'
    });
}

export  { generateAccessToken, generateRefreshToken}