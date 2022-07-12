/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: emailsHash.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var emailHash = new Schema({
		/*email: { type: String, required: true, unique: true },
		notes: [Schema.Types.Mixed]*/

		email: { type: String, required: true, unique: true, index: true },
		schedules: [{
			idSchedule: { type: Schema.Types.ObjectId, index: true },
			trademarksTags: [String],
			sectorsTags: [String],
			notes: [{
				idArticle : Schema.Types.ObjectId, 
                dateTime : String, 
                supervisor : String, 
                sended : {type: Boolean, index: true}, 
                country : String, 
                note : Schema.Types.Mixed
			}],
			clientTag: String
		}]
	});
	
	emailHash.on('index', function (err) {
		if (err) console.error(err); // error occurred during index creation
	});

	return mongoose.model('emailsHash', emailHash);
}
