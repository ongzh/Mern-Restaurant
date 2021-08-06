const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
const dishSchema = require('./dishes')

const favouritesSchema = new Schema ({
    name: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
}, {timestamp: true,
    usePushEach: true }
);

var Favourites = mongoose.model('Favourite', favouritesSchema);

module.exports = Favourites;