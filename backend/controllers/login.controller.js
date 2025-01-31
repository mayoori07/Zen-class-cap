const User = require('./../models/user.model');
const bcrypt = require('bcrypt');
const { generateJWT } = require('./../services/jwt');

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({ email: email });
        if (user == null) {
            res.json({
                status: false,
                message: 'User does not founds!!!',
            });
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch == false) {
                res.json({
                    status: false,
                    message: 'Password does not Matched!!!'
                });
            } else {
                const token = await generateJWT(email);
                const updatedUser = await User.updateOne(
                    { email: email },
                    { $set: { access_token: token } },
                    { runValidators: true }
                );
                res.json({
                    status: true,
                    message: 'Login Successfully',
                    token: token,
                    id: user.id,
                });
            }
        }
    } catch (err) {
        res.json({
            status: false,
            message: 'Whoops!!!',
            error: err
        });
    }
};