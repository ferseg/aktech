/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: passport.js
 */

var LocalStrategy = require('passport-local').Strategy;

module.exports = function (app, passport) {
  var User = app.models['users'];

  /**
   * serialize sessions
   * @param  {Object}   user - Object of user to serialize
   * @param  {callback} done - callback function
   */
  passport.serializeUser(function(pUser, pDone) {
    pDone(null, pUser.id)
  })

  /**
   * function to deserialize session info
   * @param  {String}   id   Object id
   * @param  {callback} done callback function
   */
  passport.deserializeUser(function(pId, pDone) {
    User.findOne({ _id: pId }, function (pError, pUser) {
      pDone(pError, pUser)
    })
  })

  // use local strategy
  passport.use(new LocalStrategy(
    /**
     * fucntion to validate user with the database
     * @param  {String}   username - username of the user
     * @param  {String}   password - password of the user
     * @param  {callback} done - callback function
     * @return {Callback}            [description]
     */
    function(pUsername, pPassword, pDone) {
      User.findOne({ username: pUsername, /*password: pPassword,*/ enabled: true }, function (pError, pUser) {
        if (pError) { return pDone(pError) }
        /*else { return pDone(null, pUser); }*/
        // test a matching password
        if (!pUser) {
          return pDone(null, null);
        }

        pUser.comparePassword(pPassword, function(err, isMatch) {
            if (err) return pDone(err);

            if(isMatch){
              return pDone(null, pUser);
            } else {
              return pDone(null, isMatch);
            }
        });
      });
    }
  ));
}