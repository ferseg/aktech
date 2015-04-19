/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: permissions.js
 */

module.exports = function(app, mongoose){
	/*--------------------------------------------------*/
	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var permission = new Schema({
	    name: { type: String, required: true },  
	    description: { type: String, required: false },  
	    enabled: { type: Boolean, default: true },  
	    code: { type: String, unique: true },
	    order: { type: Number, required: true }
	});
	return mongoose.model('Permission', permission);
}