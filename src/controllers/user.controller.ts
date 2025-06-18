import asyncHandler from '@/helpers/asyncHandler';
import { UserSerives } from '@/services';
import { NextFunction, Request, Response } from 'express';

// GET PROFILE
export const getMyProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await UserSerives.getMyProfile(req, res, next);
});
// SET PASSWORD WHEN USER LOGIN WITH GOOGLE
export const setPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await UserSerives.setPasswordGoogleToLocal(req, res, next);
});
