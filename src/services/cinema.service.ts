import { BadRequestError, BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Cinema from '@/models/Cinema';
import Room from '@/models/Room';
import { ShowtimeSchedule } from '@/models/ShowTime';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
// CREATE CINEMA
export const createCinema = async (req: Request, res: Response, next: NextFunction) => {
    const existingCinemas = await Cinema.find({
        $or: [{ name: req.body.name }, { address: req.body.address }],
    });
    const errors: { message: string; field: string }[] = [];
    if (existingCinemas.length > 0) {
        if (existingCinemas.some((c) => c.name === req.body.name)) {
            errors.push({ field: 'name', message: 'Tên rạp đã tồn tại!' });
        }
        if (existingCinemas.some((c) => c.address === req.body.address)) {
            errors.push({ field: 'address', message: 'Địa chỉ rạp đã tồn tại!' });
        }

        if (errors.length > 0) {
            throw new BadRequestFormError('Lỗi nhập liệu', errors);
        }
    }
    const newCinema = new Cinema({
        ...req.body,
    });
    await newCinema.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newCinema,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};
// GET ROOM BY CINEMA
export const getRoomByCinema = async (req: Request, res: Response, next: NextFunction) => {
    const { cinemaId } = req.params;

    const rooms = await Room.find({ cinemaId }).lean();

    if (!rooms || rooms.length === 0) {
        throw new BadRequestError('Không có phòng nào trong rạp này.');
    }

    const result = await Promise.all(
        rooms.map(async (room) => {
            const totalSeats = room.seats.length;
            const screening = await ShowtimeSchedule.findOne({
                roomId: room._id,
                startTime: { $gte: new Date() },
            })
                .sort({ startTime: 1 })
                .lean();

            let unavailableSeats: string[] = [];

            if (screening) {
                const now = new Date();

                const holdSeats = (screening.holdSeats || [])
                    .filter((s) => new Date(s.holdUntil) > now)
                    .map((s) => s.seatId);

                const bookedSeats = (screening.bookedSeats || []).map((s) => s.seatId);

                unavailableSeats = [...new Set([...holdSeats, ...bookedSeats])];
            }

            return {
                roomId: room._id,
                name: room.name,
                rows: room.rows,
                cols: room.cols,
                status: room.status,
                totalSeats,
                availableSeats: totalSeats - unavailableSeats.length,
            };
        }),
    );

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: result,
            message: ReasonPhrases.OK,
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
