let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let UserMessageSchema = new Schema({
    id: String,
    user_id: String,
    subject: String,
    content: String,
    image_url: String,
    date: Date,
    type: {
        type: String,
        default: 'NORMAL',
    },
    status: {
        type: String,
        default: 'NEW'
    },
});

UserMessageSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('UserMessage', UserMessageSchema);
