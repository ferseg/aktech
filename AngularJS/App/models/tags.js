/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: tags.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var tag = new Schema({
		tag: { type: String, unique: true, required: true },
		codeCollection: { type: String, required: true }
	});

	return mongoose.model('Tag', tag);
}