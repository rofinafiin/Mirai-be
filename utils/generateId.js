const crypto = require('crypto');

const generateRandomId = (prefix = '', length = 6) => {
    const random = crypto.randomBytes(length).toString('hex').slice(0, length);
    return `${prefix}${random.toUpperCase()}`;
};

module.exports = generateRandomId;