/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: logs.js
 */

module.exports = function(app, mongoose){
	/*--------------------------------------------------*/
	//Schema using mongoose
	var Schema = mongoose.Schema; 
	
	var log = new Schema({
	    type: { type: String, required: true },  
		category: { type: String, required: true },
		description: String,
		datetime: { type: Date, required: true },
	    idHost: { type: String },  
	    idUser: Schema.Types.ObjectId,
		ids: [String],
	    extraInfo: String
	});

	return mongoose.model('Log', log);
}