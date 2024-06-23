const mongoose=require('mongoose');

const { Schema, Types } = mongoose;
const TokenSchema = new mongoose.Schema({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'admin'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

module.exports = mongoose.model('Token', TokenSchema);

