/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: article.js
 */

module.exports = function(app, mongoose){
	//Schema using mongoose
	var Schema = mongoose.Schema;

	var article = new Schema({
		clients: {
			tag: String
		},
		clientsNames: [ String ],
		clientsTags: [ String ],
		originalClientTag: String,
		nameSpace: { type: String, required: true },
		tagSpace: { type: String, required: true },
		sectorsTags: [ String ],
		sectorsNames: [ String ],
		
		title: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date },
		link: { type: String },
		attachType: { type: String },

		publicity: { type: Number },
		state: { type: String, default: 0 }, // enum -> COMPLETO, EN_PROCESO, ENVIADO
		userModifications: {
			timestamp: { type: Date, default: Date.now },
			tagUser: { type: String }
		},
		sendedAlmostOnce: { type: Boolean, default: false }
	}, { strict: false});

	// Strict option: http://mongoosejs.com/docs/guide.html#strict -> this allows dynamic columns

	return mongoose.model('Article', article);
}