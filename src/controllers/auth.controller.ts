import asyncHandler from '@/helpers/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import { AuthServices } from '@/services';

// REGISTER
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await AuthServices.register(req, res, next);
});
// LOGIN
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await AuthServices.login(req, res, next);
});
// GOOGLE CLIENT LOGIN
export const loginGoogle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await AuthServices.loginGoole(req, res, next);
});
// CALLBACK LOGIN GOOGLE
export const callBackGoogle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await AuthServices.callbackLoginGoogle(req, res, next);
});
// REFRESH TOKEN
export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await AuthServices.refreshToken(req, res, next);
});
// LOGOUT
export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await AuthServices.logout(req, res, next);
});
// VERIFY ACCOUNT
export const verify = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await AuthServices.verifyAccount(req, res, next);
});
