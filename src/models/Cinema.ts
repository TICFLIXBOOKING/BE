import mongoose from 'mongoose';

const CinemaSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    phoneNumber: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'maintenance'],
        default: 'open',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

CinemaSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Cinema = mongoose.model('Cinema', CinemaSchema);
export default Cinema;
