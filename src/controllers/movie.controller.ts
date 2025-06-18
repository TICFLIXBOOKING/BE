import asyncHandler from '@/helpers/asyncHandler';
import { MovieServices } from '@/services';
import { NextFunction, Request, Response } from 'express';

// CREATE MOVIE
export const createMovie = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await MovieServices.createMovie(req, res, next);
});
