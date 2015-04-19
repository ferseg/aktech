/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: schedules.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var schedule = new Schema({
		name: { type: String, required: true },
		enabled: { type: Boolean, default: true },
	    programming: [
	    	{
		    	day: { type: String, required: true },
		    	hour: { type: String, required: true }
	    	}
		]
	});

	return mongoose.model('Schedule', schedule);
}