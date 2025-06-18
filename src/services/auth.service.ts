import config from '@/config/env.config';
import { tokenTypes } from '@/constant/token';
import { BadRequestError, BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import axios, { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import {
    deleteToken,
    generateAuthTokens,
    generateToken,
    refreshTokenGenerateAccessToken,
    saveToken,
} from './token.service';
import { forceLogoutUserById } from '@/socket/socketFunction';
import Token from '@/models/Token';
import bcrypt from 'bcryptjs';
import { defaultAvatar } from '@/constant/http';
import { sendMail } from '@/utils/sendMail';
import jwt, { JwtPayload } from 'jsonwebtoken';
// REGISTER
export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
    });
    if (existingUser) {
        const { email: existingEmail, phoneNumber: existingPhone, password } = existingUser;
        if (existingEmail === email) {
            throw new BadRequestFormError('Có lỗi nhập liệu', {
                field: 'email',
                message: !password
                    ? 'Email này đã được đăng ký và đăng nhập qua Google'
                    : 'Địa chỉ email này đã được đăng ký',
            });
        }

        if (existingPhone === phone) {
            throw new BadRequestFormError('Có lỗi nhập liệu', {
                field: 'phone',
                message: 'Số điện thoại này đã được sử dụng',
            });
        }
    }

    const newUser = await User.create({
        ...req.body,
    });
    const token = await generateToken(newUser, config.jwt.verifyTokenKey, config.jwt.verifyExpiration);
    await saveToken(token, newUser._id.toString(), tokenTypes.VERIFY_EMAIL);
    const contentEmail = {
        subject: '[TICFLIX] - Kích Hoạt Tài Khoản',
        content: {
            title: 'Kích Hoạt Tài Khoản Của Bạn',
            warning: 'Nếu bạn không kích hoạt tài khoản, bạn sẽ không sử dụng được toàn bộ dịch vụ của chúng tôi',
            description:
                'Cảm ơn bạn vì đã lựa chọn TICFLIX! Để hoàn tất việc đăng ký tài khoản, vui lòng nhấn vào đường dẫn dưới đây:',
            email: req.body.email,
        },
        link: {
            linkName: 'Kích Hoạt Tài Khoản',
            linkHerf: `http://localhost:3000/auth/verify/${token}?email=${newUser.email}`,
        },
    };
    await sendMail({ email: req.body.email, template: contentEmail, type: 'Verify' });
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newUser,
            message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.',
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};
// LOGIN
export const login = async (req: Request, res: Response, next: NextFunction) => {
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
        throw new BadRequestFormError('Có lỗi nhập liệu xảy ra', {
            field: 'email',
            message: 'Địa chỉ email này không tồn tại',
        });
    }
    if (foundUser.provider === 'google' && !foundUser.password) {
        throw new BadRequestFormError('Có lỗi nhập liệu xảy ra', {
            field: 'email',
            message: 'Email này đã được đăng ký và đăng nhập qua google',
        });
    }
    if (!foundUser.isVerified) {
        throw new BadRequestFormError('Có lỗi xảy ra', {
            message: 'Tài khoản bạn chưa được kích hoạt!',
            field: 'email',
        });
    }
    const isMatchedPassword = await bcrypt.compare(req.body.password, foundUser.password);
    if (!isMatchedPassword) {
        throw new BadRequestFormError('Có lỗi xảy ra', {
            message: 'Mật khẩu hoặc tài khoản không đúng!',
            field: 'password',
        });
    }
    forceLogoutUserById(foundUser._id.toString());
    await Token.deleteMany({ userId: foundUser._id, type: tokenTypes.REFRESH });
    const { accessToken, refreshToken } = await generateAuthTokens(foundUser);
    await saveToken(refreshToken, foundUser._id.toString(), tokenTypes.REFRESH);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth/private',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(StatusCodes.ACCEPTED).json(
        customResponse({
            data: { user: foundUser, accessToken },
            message: 'Đăng nhập thành công',
            status: StatusCodes.ACCEPTED,
            success: true,
        }),
    );
};
// LOGIN GOOGLE
export const loginGoole = async (req: Request, res: Response, next: NextFunction) => {
    const clientId = config.google.client_id;
    const redirectUri = config.google.redirect_uri;
    const scope = ['openid', 'email', 'profile'].join(' ');
    const oauth2Url =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline` +
        `&prompt=consent`;
    return res.status(HttpStatusCode.Ok).json(
        customResponse({
            data: oauth2Url,
            message: ReasonPhrases.OK,
            status: HttpStatusCode.Ok,
            success: true,
        }),
    );
};
// CALLBACK LOGIN GOOGLE
export const callbackLoginGoogle = async (req: Request, res: Response, next: NextFunction) => {
    const { error, code } = req.query;
    if (error || !code) {
        return res.redirect(`${config.client_uri}/auth/login?error=${error}`);
    }
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                client_id: config.google.client_id,
                client_secret: config.google.serect_id,
                code,
                grant_type: 'authorization_code',
                redirect_uri: config.google.redirect_uri,
            },
        });
        const { access_token, id_token } = tokenResponse.data;
        const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const { sub: googleId, email, name, picture: avatar } = userInfoResponse.data;
        let user = await User.findOne({ googleId });

        if (!user) {
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                if (existingUserByEmail.avatar === defaultAvatar) {
                    existingUserByEmail.avatar = avatar;
                }
                existingUserByEmail.googleId = googleId;
                existingUserByEmail.provider = 'google';
                existingUserByEmail.isVerified = true;
                await existingUserByEmail.save();
                user = existingUserByEmail;
            } else {
                user = new User({
                    googleId,
                    email,
                    name,
                    avatar,
                    provider: 'google',
                    isVerified: true,
                });
                await user.save();
            }
        }
        forceLogoutUserById(user._id.toString());
        await Token.deleteMany({ userId: user._id, type: tokenTypes.REFRESH });
        const { accessToken, refreshToken } = await generateAuthTokens(user);
        await saveToken(refreshToken, user._id.toString(), tokenTypes.REFRESH);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api/v1/auth/private',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.redirect(`${config.client_uri}?token=${accessToken}`);
    } catch (error) {
        return res.redirect(`${config.client_uri}/auth/login?error=server`);
    }
};
// REFRESH TOKEN
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const cookieRefreshToken = req.cookies.refreshToken;
    if (!cookieRefreshToken) {
        throw new BadRequestError('Refresh token không tồn tại');
    }
    const accessToken = await refreshTokenGenerateAccessToken(cookieRefreshToken);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: accessToken,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
// LOGOUT
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const findOneToken = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH });
    if (!findOneToken) {
        throw new BadRequestError('Không tìm thấy mã người dùng của bạn');
    }
    await Token.deleteMany({ userId: findOneToken.userId, type: tokenTypes.REFRESH });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth/private',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(StatusCodes.OK).json({ message: 'Đăng xuất thành công' });
};
// VERIFY ACCOUNT
export const verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token;
    jwt.verify(token, config.jwt.verifyTokenKey, async (err: any, decoded: any) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(StatusCodes.BAD_REQUEST).json(
                    customResponse({
                        data: {
                            type: 'expired',
                            title: 'Email xác thực này đã hết hạn',
                            descriptionOne: 'Mã xác thực mà chúng tôi gửi qua email của bạn đã hết hạn',
                            descriptionTwo:
                                'Bạn muốn xác thực lại email hãy ấn nút "gửi lại" để gửi lại email kích hoạt',
                        },
                        message: 'Mã hết hạn',
                        status: StatusCodes.BAD_REQUEST,
                        success: false,
                    }),
                );
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(StatusCodes.BAD_REQUEST).json(
                    customResponse({
                        data: {
                            type: 'invalid',
                            title: 'Email xác thực của bạn không đúng',
                            descriptionOne: 'Email xác thực mà chúng tôi gửi qua email của bạn bị lỗi',
                            descriptionTwo:
                                'Bạn muốn xác thực lại email hãy ấn nút "gửi lại" để gửi lại email kích hoạt',
                        },
                        message: 'Mã không hợp lệ',
                        status: StatusCodes.BAD_REQUEST,
                        success: false,
                    }),
                );
            }
            return res.status(StatusCodes.BAD_REQUEST).json(
                customResponse({
                    data: {
                        type: 'undefined',
                        title: 'Có lỗi xảy ra với email xác thực này này',
                        descriptionOne: 'Email xác thực mà chúng tôi gửi qua email của bạn bị lỗi hoặc sai email',
                        descriptionTwo: 'Bạn muốn xác thực lại email hãy ấn nút "gửi lại" để gửi lại email kích hoạt',
                    },
                    message: 'Không xác định',
                    status: StatusCodes.BAD_REQUEST,
                    success: false,
                }),
            );
        }
        const { userId } = decoded as JwtPayload;
        const foundToken = await Token.findOne({ token: token, type: tokenTypes.VERIFY_EMAIL });
        if (!foundToken) {
            return res.status(StatusCodes.BAD_REQUEST).json(
                customResponse({
                    data: {
                        type: 'invalid',
                        title: 'Email xác thực của bạn không đúng',
                        descriptionOne: 'Email xác thực mà chúng tôi gửi qua email của bạn bị lỗi',
                        descriptionTwo: 'Bạn muốn xác thực lại email hãy ấn nút "gửi lại" để gửi lại email kích hoạt',
                    },
                    message: 'Mã không hợp lệ',
                    status: StatusCodes.BAD_REQUEST,
                    success: false,
                }),
            );
        }
        await User.findByIdAndUpdate(userId, { isVerified: true });
        // await deleteToken(userId, tokenTypes.VERIFY_EMAIL);
        return res.status(StatusCodes.ACCEPTED).json(
            customResponse({
                data: {
                    type: 'success',
                    title: 'Tài khoản của bạn đã được kích hoạt',
                    descriptionOne: 'Bạn đã kích hoạt tài khoản của bạn thông qua gmail',
                    descriptionTwo:
                        'Bạn đã sẵn sàng sử dụng tất cả dịch vụ của chúng tôi ấn nút "Bắt đầu" để bắt đầu trải nghiệm',
                },
                status: StatusCodes.ACCEPTED,
                success: true,
                message: 'Tài khoản của bạn đã được kích hoạt thành công',
            }),
        );
    });
};
