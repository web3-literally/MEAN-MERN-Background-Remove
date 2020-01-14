let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let AdminMessageSchema = new Schema({
    id: String,
    user_id: String,
    subject: String,
    content: String,
    date: Date,
    status: {
        type: String,
        default: 'NEW'
    }
});

AdminMessageSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('AdminMessage', AdminMessageSchema);
