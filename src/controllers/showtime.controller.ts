import asyncHandler from '@/helpers/asyncHandler';
import { showTimeServices } from '@/services';

export const createShowTime = asyncHandler(async (req, res, next) => {
    return await showTimeServices.createShowTime(req, res, next);
});
