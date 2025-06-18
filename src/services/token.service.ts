import config from '@/config/env.config';
import { tokenTypes } from '@/constant/token';
import { NotAcceptableError } from '@/error/customError';
import Token from '@/models/Token';
import User from '@/models/User';
import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (user: any, key: string, expires: SignOptions['expiresIn']) => {
    const payload = { userId: user._id, role: user.role };
    const secreteKey = key;
    return jwt.sign(payload, secreteKey, { expiresIn: expires });
};

export const saveToken = async (token: string, userId: string, type: string) => {
    return await Token.create({ token, userId, type });
};

export const deleteToken = async (userId: string, type: string) => {
    return await Token.deleteMany({ userId, type });
};

export const verifyToken = async (token: string, secretKey: string, type: string) => {
    let decoded: any;
    try {
        decoded = jwt.verify(token, secretKey);
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new NotAcceptableError('Token đã hết hạn');
        }
        throw new NotAcceptableError('Token không hợp lệ');
    }
    const foundedToken = await Token.findOne({ token, type });
    if (!foundedToken) {
        throw new NotAcceptableError('Token không tồn tại trong hệ thống');
    }
    return foundedToken;
};


export const generateAuthTokens = async (user: any) => {
    const accessToken = generateToken(user, config.jwt.accessTokenKey, config.jwt.accessExpiration);
    const refreshToken = generateToken(user, config.jwt.refreshTokenKey, config.jwt.refreshTokenExpiration);
    return { accessToken, refreshToken };
};

export const refreshTokenGenerateAccessToken = async (token: string) => {
    const checkRefreshToken = await verifyToken(token, config.jwt.refreshTokenKey, tokenTypes.REFRESH);
    const user = await User.findOne({ _id: checkRefreshToken.userId });
    const accessToken = generateToken(user, config.jwt.accessTokenKey, config.jwt.accessExpiration);
    return accessToken;
};
