/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: special-deliveries.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var specialDelivery = new Schema({
		userEmail: { type: String, required: true },
		datetime: { type: Date },
		emailsToSend: [String],
	    articlesIds: [Schema.Types.ObjectId]
	});

	return mongoose.model('SpecialDelivery', specialDelivery);
}