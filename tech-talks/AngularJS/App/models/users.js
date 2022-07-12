/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: users.js
 */

var SALT_WORK_FACTOR = 10;

module.exports = function(app, mongoose){
	/*--------------------------------------------------*/
	//Schema using mongoose
	var Schema = mongoose.Schema; 
	
	var user = new Schema({
	    name: { type: String, required: true },  
		lastName1: { type: String, required: true },
		lastName2: { type: String, required: false },
		username: { type: String, unique: true, required: true },
	    password: { type: String, required: true },  
	    enabled: { type: Boolean, default: true },  
		urlFoto: { type: String, required: false },
	    tag: { type: String },
		permissions: [String],
		isAdmin: { type: Boolean, default: true, required: true },
		clientTag: [ String ],
		advanceUser: [
			{
				clientTag: String,
				advanced: Boolean
			}
		]
	});

	user.pre('save', function(next) {
	    var pUser = this;

	    // only hash the password if it has been modified (or is new)
	    if (!pUser.isModified('password')) return next();

	    // generate a salt
	    app.bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
	        if (err) return next(err);

	        // hash the password using our new salt
	        app.bcrypt.hash(pUser.password, salt, function(err, hash) {
	            if (err) return next(err);

	            // override the cleartext password with the hashed one
	            pUser.password = hash;
	            next();
	        });
	    });
	});

	user.methods.comparePassword = function(candidatePassword, cb) {
	    app.bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
	        if (err) return cb(err);
	        cb(null, isMatch);
	    });
	};
	
	return mongoose.model('User', user);
}
