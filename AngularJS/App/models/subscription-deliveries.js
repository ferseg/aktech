/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: subscription-deliveries.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var subscriptionDelivery = new Schema({
		subscriptionId: Schema.Types.ObjectId,
	    email: [String],
	    tagMediaType: [String],
	    scheduleId: Schema.Types.ObjectId,
	    tagSectors: [String],
		tagsTrademarks: [String],
		tagsCountries: [String],
		modifiedBy: String,
		modifiedDate: { type: Date },
		enabled: { type: Boolean, default: true, index: true }
	});

	return mongoose.model('SubscriptionDelivery', subscriptionDelivery);
}