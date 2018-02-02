const crypto = require('crypto');

exports.hash = function(password) {
    return crypto.createHash('sha512').update(password).digest('hex');
}
