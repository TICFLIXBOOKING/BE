import { BadRequestError } from '@/error/customError';
import customResponse from '@/helpers/response';
import { Showtime, ShowtimeSchedule } from '@/models/ShowTime';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { isArray } from 'lodash';

export interface IShowtimeSchedule {
    showtimeId: string;
    startTime: Date;
    endTime: Date;
    // bookedSeats: I[];
    // holdSeats: IHoldSeat[];
    status: 'available' | 'sold-out' | 'cancelled';
}

// CREATE SHOWTIME SCHEDULE
const createShowTimeSchedule = async (showTimeScheduleItem: IShowtimeSchedule[]) => {
    let errors = [];
    const exitstingShowTimeArray = await showTimeScheduleItem.map(async (item) => {
        return await ShowtimeSchedule.find({
            showtimeId: item.showtimeId,
            status: 'available',
            $or: [
                {
                    startTime: { $lt: item.endTime },
                    endTime: { $gt: item.startTime },
                },
            ],
        });
    });
    errors.push(exitstingShowTimeArray);
};

// CREATE SHOWTIME
export const createShowTime = async (req: Request, res: Response, next: NextFunction) => {
    const { movieId, cinemaId, roomId } = req.body;
    const exitstingShowTime = await Showtime.findOne({ movieId, cinemaId, roomId });
    if (exitstingShowTime) {
        throw new BadRequestError('Xuất chiếu này đã tồn tại');
    }
    const newShowTime = await Showtime.create({ ...req.body });
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newShowTime,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};
