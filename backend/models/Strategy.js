const bcrypt = require('bcrypt');

class HashingStrategy {
    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }
    
    async hash(password) {
        if (!password) {
            throw new Error('Password cannot be empty.');
        }
        const salt = await bcrypt.genSalt(this.saltRounds);
        return bcrypt.hash(password, salt);
    }
}

module.exports = HashingStrategy;