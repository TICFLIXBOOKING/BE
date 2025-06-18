import { BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Movie from '@/models/Movie';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// CREATE MOVIE
export const createMovie = async (req: Request, res: Response, next: NextFunction) => {
    const existingMovie = await Movie.findOne({ name: req.body.name });
    if (existingMovie) {
        throw new BadRequestFormError('Nhập liệu lỗi', {
            field: 'name',
            message: 'Tên phim này đã tồn tại trong hệ thống',
        });
    }
    const newMovie = new Movie({
        ...req.body,
    });
    await newMovie.save();
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newMovie,
            status: StatusCodes.CREATED,
            message: 'Thêm phim thành công',
            success: true,
        }),
    );
};
