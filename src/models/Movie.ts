import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 1,
        maxlength: 200,
    },
    description: {
        type: String,
        default: '',
        maxlength: 2000,
    },
    duration: {
        type: Number,
        required: true,
    },
    director: {
        type: String,
        default: '',
        maxlength: 100,
    },
    cast: {
        type: [String],
        default: [],
    },
    releaseDate: {
        type: Date,
    },
    genres: {
        type: [String],
        default: [],
    },
    language: {
        type: String,
        default: 'Unknown',
    },
    posterUrl: {
        type: String,
        default: '',
    },
    trailerUrl: {
        type: String,
        default: '',
    },

    status: {
        type: String,
        enum: ['draft', 'active', 'inactive', 'cancelled', 'archived'],
        default: 'draft',
        // draft: phim chưa công chiếu
        // active: đang chiếu, bình thường
        // inactive: tạm ngừng chiếu (vd: lỗi, chờ xử lý)
        // cancelled: huỷ chiếu hẳn
        // archived: phim kết thúc thời gian chiếu, lưu trữ
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Cập nhật updatedAt mỗi lần lưu
MovieSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
