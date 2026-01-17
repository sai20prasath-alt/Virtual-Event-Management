const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
            default: 'Virtual',
        },
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        maxParticipants: {
            type: Number,
            default: null,
        },
        status: {
            type: String,
            required: true,
            enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
            default: 'scheduled',
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.statics.findByOrganizerId = function(organizerId) {
    return this.find({ organizerId });
};

module.exports = mongoose.model('Event', eventSchema);
