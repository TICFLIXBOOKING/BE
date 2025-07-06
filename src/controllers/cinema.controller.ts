import asyncHandler from '@/helpers/asyncHandler';
import { CinemaServices } from '@/services';
import { NextFunction, Request, Response } from 'express';

// CREATE CINEMA
export const createCinema = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await CinemaServices.createCinema(req, res, next);
});
// GET ROOM BY CINEMA
export const getRoomByCinema = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await CinemaServices.getRoomByCinema(req, res, next);
});
