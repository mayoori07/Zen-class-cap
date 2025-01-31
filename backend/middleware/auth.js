const User = require('./../models/user.model');

const auth = async (req, res, next) => {
    const token = req.body.token;
    const user = await User.findOne({ access_token: token });
    if (user == null) {
        res.json({ status: false, message: 'Token is expired!' });
    } else {
        next();
    }
};

module.exports = auth;