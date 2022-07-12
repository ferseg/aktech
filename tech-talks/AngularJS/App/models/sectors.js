/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: sectors.js
 */


module.exports = function(app, mongoose) {
	
	var Schema = mongoose.Schema;  

	var sectors = new Schema({
	    detail: { type: String, required: true },
		tag: { type: String, required: true },
		tagFather: String
	});
	return mongoose.model('Sector', sectors);
}
