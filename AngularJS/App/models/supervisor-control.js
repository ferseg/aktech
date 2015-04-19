/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: supervisor-control.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;

	var supervisor_control = new Schema({
		datetime: { type: Date, required: true, default: Date.now },
		supervisor: { type: String },
		aprooved: { type: Boolean, default: false },
		timeAprooved: { type: Date },
		timeInsertion: { type: Date },
		sended: { type: Boolean, default: false },
		idsSubscriptionsDeliveries: [Schema.Types.ObjectId],
		articles: [String],
		cancel: { type: Boolean, default: false }
	});

	// Strict option: http://mongoosejs.com/docs/guide.html#strict -> this allows dynamic columns

	return mongoose.model('SupervisorControl', supervisor_control);
}