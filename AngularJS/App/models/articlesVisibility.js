/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: articlesVisibility.js
 */

module.exports = function(app, mongoose){
    //Schema using mongoose
    var Schema = mongoose.Schema;

    var articlesVisibility = new Schema({
        email: { type: String, required: true, index: true },
        idArticle: Schema.Types.ObjectId,
        dateArticle: {type: Date, index: true},
        clientTag: String
    }, { strict: false});

    // Strict option: http://mongoosejs.com/docs/guide.html#strict -> this allows dynamic columns

    return mongoose.model('ArticlesVisibility', articlesVisibility);
}