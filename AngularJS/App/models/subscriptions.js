/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: subscriptions.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var subscription = new Schema({
	    dateStart: { type: Date, default: Date.now },  
		dateEnd: { type: Date, required: true },
		enabled: { type: Boolean, default: true },
		tagMediaType: [String],
		tagNews: [String],
		tagPublicity: [String],
		tagSocialNetwork: [String],
		tagSectors: [String],
		clientID: Schema.Types.ObjectId,
		tagsTrademarks: [String]
	});

	return mongoose.model('Subscription', subscription);
}