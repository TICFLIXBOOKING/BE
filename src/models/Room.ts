import mongoose, { Document, Schema, Model } from 'mongoose';

// -----------------------------
// Type Definitions
// -----------------------------
export interface ISeat {
    row: number;
    col: number;
    label: string;
    type: 'regular' | 'vip' | 'couple';
    colSpan: number;
}

export interface ISeatType {
    type: 'regular' | 'vip' | 'couple';
    factor: number;
    color: string;
}

export interface IRoom extends Document {
    name: string;
    cinemaId: mongoose.Types.ObjectId;
    rows: number;
    cols: number;
    seats: ISeat[];
    seatTypes: ISeatType[];
    status: 'available' | 'unavailable' | 'maintenance';
    createdAt: Date;
    updatedAt: Date;
}

// -----------------------------
// Schema Definitions
// -----------------------------
const SeatSchema = new Schema<ISeat>({
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    label: { type: String, required: true },
    type: {
        type: String,
        enum: ['regular', 'vip', 'couple'],
        default: 'regular',
    },
    colSpan: {
        type: Number,
        default: 1,
    },
});

const SeatTypeSchema = new Schema<ISeatType>(
    {
        type: {
            type: String,
            enum: ['regular', 'vip', 'couple'],
            required: true,
        },
        factor: {
            type: Number,
            required: true,
            default: 1,
        },
        color: {
            type: String,
            required: true,
        },
    },
    { _id: false },
);

const RoomSchema = new Schema<IRoom>({
    name: { type: String, required: true },
    cinemaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cinema',
        required: true,
    },
    rows: { type: Number, required: true },
    cols: { type: Number, required: true },
    seats: [SeatSchema],
    seatTypes: [SeatTypeSchema],
    status: {
        type: String,
        enum: ['available', 'unavailable', 'maintenance'],
        default: 'available',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

RoomSchema.pre<IRoom>('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Room: Model<IRoom> = mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
