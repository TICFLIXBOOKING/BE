import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        min: 3,
    },
    avatar: {
        type: String,
        default:
            'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function () {
            return this.provider === 'local';
        },
    },
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    provider: {
        type: String,
        enum: ['google', 'local'],
        default: 'local',
    },
    isVerified: {
        type: Boolean,
        default: function () {
            return this.provider === 'google';
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
UserSchema.pre('save', async function (next) {
    if (this.provider === 'local' && this.password) {
        if (this.isNew || this.isModified('password')) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
    }
    next();
});
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    obj.hasPassword = !!this.password;
    return obj;
};
UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
const User = mongoose.model('User', UserSchema);
export default User;
