/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: sentEmails.js
 */

module.exports = function(app, mongoose){

    //Schema using mongoose
    var Schema = mongoose.Schema;  

    var sentEmail = new Schema({
        supervisorControl: Schema.Types.ObjectId,
        email: String,
        mail: Schema.Types.Mixed,
        sent: { type: Date, required: true, default: Date.now }
    }, { strict: false});

    return mongoose.model('sentEmail', sentEmail);
}