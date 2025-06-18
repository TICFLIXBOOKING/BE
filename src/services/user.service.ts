import { BadRequestError, BadRequestFormError, UnAuthenticatedError, UnAuthorizedError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) {
        throw new UnAuthorizedError('Không có userId ở trong token');
    }
    const foundedUser = await User.findOne({ _id: userId });
    if (!foundedUser) {
        throw new UnAuthenticatedError('Không tìm thấy user');
    }
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: foundedUser,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

export const setPasswordGoogleToLocal = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    if (!userId) {
        throw new UnAuthenticatedError('Không có userId ở trong Token');
    }
    const foundUser = await User.findOne({ _id: userId });
    if (!foundUser) {
        throw new BadRequestError('Người dùng không tồn tại');
    }
    if (foundUser.password) {
        throw new BadRequestFormError(
            'Có lỗi xảy ra',
            {
                message: 'Tài khoản đã có mật khẩu',
                field: 'password',
            },
            StatusCodes.BAD_REQUEST,
        );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    foundUser.password = hashedPassword;
    await foundUser.save();
    return res.status(StatusCodes.OK).json({ message: 'Đặt mật khẩu thành công' });
};
