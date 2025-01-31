const jwt = require('jsonwebtoken');

const generateJWT = (email) => {
    const secretKey = process.env.JWT_KEY;
    const payload = {
        email: email,
    };
    const options = {
        expiresIn: '1h',
    };
    const accessToken = jwt.sign(payload, secretKey, options);
    return accessToken;
}

module.exports = { generateJWT };