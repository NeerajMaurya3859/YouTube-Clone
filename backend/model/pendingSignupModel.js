import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    photoUrl: {
        type: String,
        default: ""
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    lastSentAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

pendingSignupSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const PendingSignup = mongoose.model(
    "PendingSignup",
    pendingSignupSchema
);

export default PendingSignup;