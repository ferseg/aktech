/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: spaces.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var spaces = new Schema({
		name: { type: String, required: true },
	    country: { type: String, required: true },
		tag: { type: String, required: true },
		mediaType: Schema.Types.ObjectId,
		company: { type: String, required: true },
		isAutomatic: { type: Boolean, required: true, default: false},
		enabled: { type: Boolean, default: true }
	});

	return mongoose.model('Space', spaces);
}