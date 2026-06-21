import { body } from 'express-validator';

const registrationValidation = [
    body('firstName').trim().notEmpty().withMessage('First name is required')
        .isLength({ max: 100 }).withMessage('First name too long')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name contains invalid characters'),
    body('lastName').trim().notEmpty().withMessage('Last name is required')
        .isLength({ max: 100 }).withMessage('Last name too long')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name contains invalid characters'),
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .isLength({ max: 255 }).withMessage('Email too long')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
        .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain a number')
        .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain a special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Passwords do not match');
        return true;
    }),
];

const loginValidation = [
    body('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Must be a valid email')
        .isLength({ max: 255 }).normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ max: 128 }).withMessage('Password too long'),
];

export { registrationValidation, loginValidation };