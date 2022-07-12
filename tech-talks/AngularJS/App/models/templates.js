/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: templates.js
 */

module.exports = function(app, mongoose){
	/*--------------------------------------------------*/
	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var template = new Schema({
	    tag: { type: String, unique: true },
	    html: { type: String, required: true },
	    userModifications: [{
			timestamp: { type: Date, default: Date.now },
			tagUser: { type: String }
		}]
	});
	return mongoose.model('Template', template);
}