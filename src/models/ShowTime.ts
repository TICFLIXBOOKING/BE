import mongoose from 'mongoose';
const { Schema } = mongoose;
const ShowtimeSchema = new Schema(
    {
        movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
        cinemaId: { type: Schema.Types.ObjectId, ref: 'Cinema', required: true },
        roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
        priceMultiplier: { type: Number, default: 1 },
        status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    },
    {
        timestamps: true,
    },
);
const ShowtimeScheduleSchema = new Schema(
    {
        showtimeId: { type: Schema.Types.ObjectId, ref: 'Showtime', required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        bookedSeats: [
            {
                seatId: { type: String, required: true },
            },
        ],
        holdSeats: [
            {
                seatId: { type: String, required: true },
                userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                holdUntil: { type: Date, required: true },
            },
        ],
        status: { type: String, enum: ['available', 'sold-out', 'cancelled'], default: 'available' },
    },
    {
        timestamps: true,
    },
);
ShowtimeScheduleSchema.index({ startTime: 1 });
const Showtime = mongoose.model('Showtime', ShowtimeSchema);
const ShowtimeSchedule = mongoose.model('ShowtimeSchedule', ShowtimeScheduleSchema);

export { Showtime, ShowtimeSchedule };
