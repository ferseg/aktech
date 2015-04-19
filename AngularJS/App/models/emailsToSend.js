/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: emailsToSend.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var emailsToSend = new Schema({
		supervisorControl: Schema.Types.Mixed,
		emails: [Schema.Types.Mixed],
		sended: { type: Boolean, required: true, default: false, index: true }
	}, { strict: false});

	return mongoose.model('emailsToSend', emailsToSend);
}