const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['registered', 'attended', 'cancelled'],
            default: 'registered',
        },
        registrationDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

participantSchema.index({ userId: 1, eventId: 1 }, { unique: true });

participantSchema.statics.findByUserId = function(userId) {
    return this.find({ userId }).populate('eventId');
};

participantSchema.statics.findByEventId = function(eventId) {
    return this.find({ eventId }).populate('userId');
};

participantSchema.statics.isParticipant = function(userId, eventId) {
    return this.findOne({ userId, eventId });
};

module.exports = mongoose.model('Participant', participantSchema);
