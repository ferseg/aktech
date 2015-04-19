/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: publicity.js
 */

module.exports = function(app, mongoose){

	var Schema = mongoose.Schema;  

	var publicity = new Schema({
	    mediaType: { type: String, required: true },
	    edition: String,
	    size: String,
	    currency: { type: String, required: true },
	    value: Number,
	    scope: Number
	});
	return mongoose.model('publicity', publicity);
}