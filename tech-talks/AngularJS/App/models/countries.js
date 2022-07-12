/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: countries.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var country = new Schema({
		name: { type: String, required: true },
		enabled: { type: Boolean, default: true },
		tag: { type: String, required: true }
	});

	return mongoose.model('Country', country);
}