let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let BackgroundSchema = new Schema({
    id: String,
    url: String,
    visible_flag: Boolean,
    owner_id: String,
    user_list: Array,
});

BackgroundSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('Background', BackgroundSchema);
