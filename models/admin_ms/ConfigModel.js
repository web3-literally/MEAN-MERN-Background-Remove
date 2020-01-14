let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let ConfigSchema = new Schema({
    id: String,
    theme_index: Number,
});

ConfigSchema.pre('save', function (next) {
    this.id = this._id.toString();
    next();
});
module.exports = mongoose.model('Config', ConfigSchema);
