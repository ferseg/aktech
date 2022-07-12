
module.exports = function(app, mongoose){
	/*--------------------------------------------------*/
	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var message = new Schema({
	    sender: { type: String, required: true },
		receiver: { type: String, required: true },
		message: { type: String, required: true },
		wasSend: { type: Boolean, default: false },
		wasRead: { type: Boolean, default: false },
		createdDate: { type: Date, required: true, default: Date.now}
	});
	return mongoose.model('Message', message);
}