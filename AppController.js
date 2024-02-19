const otpGenerator = require('otp-generator')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const UserModel = require('./UserModel');
const OtpModel = require('./OtpModel');
//Register post Controller

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const client = require('twilio')(accountSid, authToken);

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;





//Register user using his given number using otp system.
const Register = async (req, resp) => {
    //console.log("nnnnn",req.body.number);
    try {
        let number = req.body.number;
        let existing = await UserModel.findOne({ number })

        if (existing != null) {
            resp.status(200).send({ result: "This number is already registered you can log in.", Response: null });
        } else {
            const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            client.messages
                .create({
                    body: `${otp} is your One Time Password (OTP) to complete your registeraton into Davination. Thank you for using Davination @davination007@gmail.com`,
                    from: '+17603133827',
                    to: `+91${number}`
                }).then((response) => {

                    if (response.sid != null) {
                        let data = new OtpModel({ otp: otp });
                        data.save().then((rr) => {
                            resp.status(200).send({ result: "OTP has been sent to your number", Response: response.sid });
                            console.log(rr)
                        }).catch((errr) => {
                            resp.status(300).send({ result: "Having issue while securing otp", Response: null });
                            console.log("while saving otp", errr);
                        })
                    } else {
                        resp.status(300).send({ result: "Sorry We won't be able to  verify OTP this time.", Response: null });
                    }
                }).catch((error) => {
                    console.log("while sending", error);
                    resp.status(400).send({ result: "Having some network issue while sending OTP.", Response: null });
                })
        }
    } catch (e) {
        resp.status(500).send({ result: "This is a fatal issue.", Response: null });
    }

}


//verify user otp for register user

const verifyOTP = async (req, resp) => {
    try {
        const otp = req.body.ottp;
        const result = await OtpModel.findOneAndDelete({ otp });
        if (result != null) {
            resp.status(200).send({ result: "User otp verified successfully.", Response: result });
        } else {
            resp.status(300).send({ result: "Opps please put correct OTP plzzz.", Response: result });
        }
    } catch (e) {
        resp.status(500).send({ result: "It is a fatal issue.", Error: null });
    }
}


//verify user otp for login user
const verifyLoginuserOTP = async (req, resp) => {
    try {
        const otp = req.body.otp;
        const number = req.body.number;
        const userinfo = await UserModel.findOne({ number });
        //console.log("userinfo",userinfo);
        const result = await OtpModel.findOneAndDelete({ otp });
        console.log("first", result);
        if (result != null) {
            console.log("result", result);
            console.log("userinfo", userinfo);
            const token = jwt.sign(userinfo.toJSON(), process.env.JWT_SECRET, { expiresIn: "2h" });
            resp.status(200).send({ result: "User otp verified successfully.", Response: result, token: token, userinfo: userinfo });
        } else {
            resp.status(300).send({ result: "Opps put correct otp plzzz.", Response: result });
            console.log("error", result);
        }
    } catch (e) {
        resp.status(500).send({ result: "It is a fatal issue.", Error: null });
        console.log("fatal", e)
    }
}

//login using number  and sending otp as well as.

const login = async (req, resp) => {
    try {
        const number = req.body.number;
        let existing = await UserModel.findOne({ number })
        console.log("existing", existing);
        if (existing == null) {
            resp.status(200).send({ result: "There is no any account associated with this number try to register.", Response: existing });
        } else {
            const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
            client.messages
                .create({
                    body: `${otp} is your One Time Password (OTP) to complete your login process into Davination. Thank you for using Davination @davination007@gmail.com`,
                    from: '+17603133827',
                    to: `+91${number}`
                })
                .then((response) => {
                    if (response.sid != null) {
                        let data = new OtpModel({ otp: otp });
                        data.save().then((rr) => {
                            resp.status(200).send({ result: "OTP has been sent to your number", Response:existing});
                            console.log(rr)
                        }).catch((errr) => {
                            resp.status(300).send({ result: "Having issue while securing otp", Error: null });
                            console.log("while saving otp", errr);
                        })
                    } else {
                        resp.status(300).send({ result: "Sorry We won't be able to  verify OTP this time.", Error: null });
                    }
                }).catch((error) => {
                    resp.status(400).send({ result: "Sorry we are having some technicale issue right now.", Error: error });
                })
        }

    } catch (e) {
        resp.status(500).send({ result: "It is a fatal issue.", Error: null });
        console.log(e);
    }
}


//reset otp
const ResendOTP = async (req, resp) => {
    try {
        let number = req.body.number;
        const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        client.messages
            .create({
                body: `${otp} is your One Time Password (OTP) to complete your login process into Davination. Thank you for using Davination @davination007@gmail.com`,
                from: '+17603133827',
                to: `+91${number}`
            }).then((response) => {
                if (response.sid != null) {
                    let data = new OtpModel({ otp: otp });
                    data.save().then((rr) => {
                        resp.status(200).send({ result: "OTP has been sent to your number", Response: response.sid });
                        console.log(rr)
                    }).catch((errr) => {
                        resp.status(300).send({ result: "Having issue while securing otp", Error: null });
                        console.log("while saving otp", errr);
                    })
                } else {
                    resp.status(300).send({ result: "Sorry We won't be able to  verify OTP this time.", Error: null });
                }
            }).catch((error) => {
                resp.status(400).send({ result: "Sorry we are having some network issue right now.", Error: error });
            })
    } catch (e) {
        resp.status(500).send({ result: "It is a fatal issue.", Error: null });
        console.log(e);
    }
}

// Invite code registration.
const InviteRegistration = async (req, resp) => {
    
    try {
        const referalCode = req.body.Icode;
        const number = req.body.number;
        
        const referaluser = await UserModel.findOne({ referalCode });
        if (referaluser != null) {

            const userExist = await UserModel.findOne({ number });
            if (userExist == null) {
                const otp = otpGenerator.generate(4, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
                client.messages
                    .create({
                        body: `${otp} is your One Time Password (OTP) to complete your login process into Davination. Thank you for using Davination @davination007@gmail.com`,
                        from: '+17603133827',
                        to: `+91${number}`
                    }).then((response) => {
                        if (response.sid != null) {
                            let data = new OtpModel({ otp: otp });
                            data.save().then((rr) => {
                                resp.status(200).send({ result: "OTP has been sent to your number", Response: response.sid });
                                //console.log(rr)
                            }).catch((errr) => {
                                resp.status(300).send({ result: "Having issue while generating OTP", Error: null });
                                // console.log("while saving otp", errr);
                            })
                        } else {
                            resp.status(300).send({ result: "Sorry We won't be able to send OTP at this time.", Error: null });
                        }
                    }).catch((error) => {
                        resp.status(400).send({ result: "Sorry We are having technicale issue right now.", Error: error });
                    })
            } else {
                resp.status(300).send({ result: "This number is already associated with another account you can log in.", Response: null });
                //console.log("userexist no", userExist);
            }
        } else {
            //console.log("referaluser no", referaluser);
            resp.status(300).send({ result: "You are using an invalid referal code try with other.", Error: null });
        }
    } 
    catch (e) {
        resp.status(500).send({ result: "Having some fatal issue now.", Error: e });
    }
    
}



//Saving data at the end of registration
const Savedata = async (req, resp) => {
    const { firstname, lastname, emailid,state, number, inviteCode, referalCode } = req.body;
    try {
        if (inviteCode != null) {
            await UserModel.updateOne({ referalCode: inviteCode },
                { $inc: { bonus: 50 } }).then(async (response) => {
                    let data = UserModel({ firstname, lastname, emailid,state, number, referalCode })
                    await data.save({ new: true })
                        .then((response) => {
                            // create jwt token
                            const token = jwt.sign({firstname, lastname, emailid,state, number, referalCode}, process.env.JWT_SECRET, { expiresIn: "2h" });
                            resp.status(200).send({ result: "Registered successfully,", Response: response, token: token });
                        }).catch((error) => {
                            resp.status(400).send({ result: "Having issue while saving data.", Error: error });
                            //console.log(error)
                        })
                }).catch((err) => {
                    resp.status(400).send({result:"Having issue while fetching Inviter details.",Error:err});
                })
        } else {
            let data = UserModel({ firstname, lastname, emailid,state, number, referalCode })
            await data.save({ new: true })
                .then((response) => {
                    // create jwt token
                    const token = jwt.sign({firstname, lastname, emailid,state, number, referalCode}, process.env.JWT_SECRET, { expiresIn: "2h" });
                    resp.status(200).send({ result: "Registered successfully,", Response: response, token: token });
                }).catch((error) => {
                    resp.status(400).send({ result: "Having issue while saving data.", Error: error });
                })
            }
    } catch (e) {
        resp.status(500).send({ result: "This is a fatal issue.", Error: e });
    }
}



const insertotp = async (req, resp) => {
    const otp = req.body.otp;
    const daatta = new OtpModel({ otp });
    await daatta.save().then((rr) => console.log("rrr", rr)).catch((ee) => console.log("33", ee));
}

/*
User.updateOne({username:'diididdi'}, 
    {$inc:{Balance:5}}).then((respo)=>{
        console.log(respo)
    }).catch((err)=>{
        console.log(err)
    });
    */
/*
    app.get('/inc', (req, res) => {

        try{
            User.updateOne({username:'diididdi'},
            {$inc:{Balance:100}}).then((response)=>{
                console.log(response)
            }).catch((err)=>{
                console.log('eeror',err)
            })

        }catch{

            res.send('getting error');
        }

        res.status(200).send(response);
    });



*/

module.exports = { Savedata, Register, verifyOTP, login, verifyLoginuserOTP, ResendOTP, insertotp, InviteRegistration };

