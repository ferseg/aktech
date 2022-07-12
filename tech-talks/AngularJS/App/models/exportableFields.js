/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: exportableFields.js
 */

module.exports = function(app, mongoose){
	/*--------------------------------------------------*/
	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var exportableFields = new Schema({
		tag: { type: String, required: true },
	    fields: [{
	    	name: String,
	    	label: String
	    }]
	});
	return mongoose.model('ExportableFields', exportableFields);
}