//
//	This is the main database connection file.
//

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Comment = new Schema({
    title : String,
});

mongoose.model('comments', Comment);


var Event = new Schema({
	Name: String,
	Location: String,
    title : String,
});

mongoose.model('Event', Event);



mongoose.connect('mongodb://TestApp:T3stPWD@ds017256.mlab.com:17256/heroku_phd1k3f3');