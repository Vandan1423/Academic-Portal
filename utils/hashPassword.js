const bcrypt = require("bcryptjs");

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
};

/**
 * Compare plain text password with hashed password
 * @param {string} candidatePassword - Plain text password to compare
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match
 */
const comparePassword = async (candidatePassword, hashedPassword) => {
    return await bcrypt.compare(candidatePassword, hashedPassword);
};

module.exports = {
    hashPassword,
    comparePassword,
};
