/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: client.js
 */

module.exports = function(app, mongoose){
	/*--------------------------------------------------*/
	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var client = new Schema({
	    name: { type: String, required: true },
		tag: { type: String, required: true },
		logo: { type: String, required: false },
		slogan: String,
		color: String,
		enabled: { type: Boolean, required: true, default: true },
		trademarks: [
			{
				name: { type: String, required: true },
				logo: { type: String, required: true },
				tag: { type: String, required: true },
				isCompetency: { type: Boolean, default: false },
				enabled: { type: Boolean, required: true, default: true },
				products: [
					{
						name: { type: String, required: true },
						logo: { type: String, required: true },
						tag: { type: String, required: true },
						isCompetency: { type: Boolean, default: false },
						enabled: { type: Boolean, required: true, default: true }
					}
				]
			}
		],
		createdBy: Schema.Types.ObjectId,
		createdDate: { type: Date, required: true, default: Date.now},
		fields: [
			{
				name: { type: String, required: true },
				fieldType: { type: String, required: true },
				defaultValue: Schema.Types.Mixed,
				required: { type: Boolean, required: true},
				measurable: { type: Boolean, required: true }
			}
		]
	});
	return mongoose.model('Client', client);
}