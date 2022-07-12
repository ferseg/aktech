/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: tagsHash.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var tagHash = new Schema({
		tag: { type: String, required: true, unique: true },
		emails: [String]
	});

	return mongoose.model('tagsHash', tagHash);
}