let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let ActivityHistorySchema = new Schema({
    id: String,
    user_id: String,
    history_date: Date,
    origin_url: String,
    background_url: String,
    result_url: String,
});

ActivityHistorySchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('Activity', ActivityHistorySchema);
