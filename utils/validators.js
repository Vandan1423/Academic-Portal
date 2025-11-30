const { body, validationResult } = require("express-validator");

/**
 * Validation rules for signup
 */
const signupValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    
    body("confirmPassword")
        .notEmpty()
        .withMessage("Please confirm your password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
];

/**
 * Validation rules for login
 */
const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => err.msg).join(", ");
        const referer = req.get("referer") || "/";
        return res.redirect(`${referer}?error=${encodeURIComponent(errorMessages)}`);
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation,
    handleValidationErrors,
};
