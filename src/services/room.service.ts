// services/room.service.ts
import { BadRequestError, BadRequestFormError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Room from '@/models/Room';
import Cinema from '@/models/Cinema';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
// CREATE ROOM
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { name, cinemaId, seats, rows, cols, seatTypes } = req.body;
    const errors: { message: string; field: string }[] = [];
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
        throw new BadRequestError('Rạp này không tồn tại');
    }
    const existingRoom = await Room.findOne({ name, cinemaId });
    if (existingRoom) {
        errors.push({ field: 'name', message: 'Phòng chiếu này đã tồn tại trong rạp!' });
    }
    if (errors.length > 0) {
        throw new BadRequestFormError('Lỗi nhập liệu', errors);
    }
    if (!Array.isArray(seats) || seats.length === 0) {
        throw new BadRequestError('Phòng chiếu phải có sơ đồ ghế.');
    }
    const newRoom = new Room({
        name,
        cinemaId,
        seats,
        rows,
        cols,
        seatTypes,
    });
    await newRoom.save();
    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newRoom,
            message: ReasonPhrases.CREATED,
            status: StatusCodes.CREATED,
            success: true,
        }),
    );
};
// GET ROOM
export const getDetailedRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;

    const rooms = await Room.findOne({ roomId }).lean();
    if (!rooms) {
        throw new BadRequestError('Không có phòng chiếu này');
    }
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: rooms,
            message: 'Xem chi tiết phòng chiếu',
            status: StatusCodes.OK,
            success: true,
        }),
    );
};

// UPDATE ROOM
export const updateRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    const { name, cinemaId, seats, rows, cols, seatTypes } = req.body;
    const errors: { message: string; field: string }[] = [];

    const room = await Room.findById(roomId);
    if (!room) {
        throw new BadRequestError('Phòng chiếu không tồn tại');
    }
    if (name && name !== room.name) {
        const existingRoom = await Room.findOne({ name, cinemaId: cinemaId || room.cinemaId });
        if (existingRoom && existingRoom._id.toString() !== roomId) {
            errors.push({ field: 'name', message: 'Phòng chiếu này đã tồn tại trong rạp!' });
        }
    }
    if (errors.length > 0) {
        throw new BadRequestFormError('Lỗi nhập liệu', errors);
    }
    if (!Array.isArray(seats) || seats.length === 0) {
        throw new BadRequestError('Phòng chiếu phải có sơ đồ ghế.');
    }
    const mappedSeats = seats.map((seat: any) => ({
        ...seat,
        type: seat.colSpan === 2 ? 'couple' : seat.type,
    }));
    room.name = name || room.name;
    room.rows = rows;
    room.cols = cols;
    room.seats = mappedSeats;
    room.seatTypes = seatTypes;

    await room.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: room,
            message: 'Cập nhật phòng chiếu thành công',
            status: StatusCodes.OK,
            success: true,
        }),
    );
};
