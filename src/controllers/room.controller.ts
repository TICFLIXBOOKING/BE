import asyncHandler from "@/helpers/asyncHandler";
import { RoomServices } from "@/services";
import { NextFunction, Request, Response } from "express";

// CREATE ROOM
export const createRoom = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await RoomServices.createRoom(req, res, next);
});
// GET ROOM
export const getDetailedRoom = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await RoomServices.getDetailedRoom(req, res, next);
});
// UPDATE ROOM
export const updateRoom = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await RoomServices.updateRoom(req, res, next);
});