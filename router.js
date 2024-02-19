const Router = require('express');
const router = Router();

/** import all controllers */

const {Savedata,Register,InviteRegistration,verifyOTP,login,verifyLoginuserOTP,ResendOTP,insertotp} = require('./AppController');



/** POST Methods */
router.route('/register').post(Register)
router.route('/Login/sendOTP').post(login);
router.route('/InviteCode/Registration').post(InviteRegistration);
router.route('/resetOTP').post(ResendOTP)
//router.route('/verify/loginuser/OTP').post(verifyLoginuserOTP);
router.route('/verifyOTP').post(verifyOTP);
router.route('/savedata').post(Savedata); // save user data

// insert otp in mongo db
router.route('/testingotp').post(insertotp);

/*
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables


/** PUT Methods */
/*
router.route('/updateuser').put(Auth, controller.updateUser); // is use to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // use to reset password
*/

module.exports = router;
