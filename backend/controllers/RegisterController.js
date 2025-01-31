const User = require('./../models/user.model');
const bcrypt = require('bcrypt');
const { generateJWT } = require('./../services/jwt');

exports.test = async (req, res) => {
    try {
        res.json({ status: true, message: 'success' });
    } catch (err) {
        res.json({ status: false, message: 'Whoops!!!' });
    }
}

exports.store = async (req, res) => {
    try {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        const saltRounds = 10;
        let hashed = await bcrypt.hash(password, saltRounds);
        const accessToken = await generateJWT(email);
        let user = new User({
            username: username,
            email: email,
            access_token: accessToken,
            password: hashed
        });
        await user.save();
        res.json({
            status: true,
            message: 'Account Registered!',
            token: accessToken
        });
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
}