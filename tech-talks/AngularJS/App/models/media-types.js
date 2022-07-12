/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: media-types.js
 */

module.exports = function(app, mongoose){

	//Schema using mongoose
	var Schema = mongoose.Schema;  

	var mediaType = new Schema({
		name: { type: String, required: true },
		tag: { type: String, required: true },
		fields: [
			{
				name: { type: String, required: true },
				fieldType: { type: String, required: true },
				defaultValue: Schema.Types.Mixed,
				required: { type: Boolean, required: true},
				measurable: { type: Boolean, required: true },
				isExclusive: { type: Boolean, default: false }
			}
		]
	});

	return mongoose.model('MediaType', mediaType);
}