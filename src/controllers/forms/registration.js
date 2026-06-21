import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { createUser, findUserByEmail } from '../../models/forms/registration.js';

const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'Create Account',
        errors: [],
        formData: {}
    });
};

const processRegistration = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('forms/registration/form', {
            title: 'Create Account',
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        const { firstName, lastName, email, password } = req.body;
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            req.flash('warning', 'An account with that email already exists.');
            return res.redirect('/register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser({ firstName, lastName, email, password: hashedPassword });
        req.flash('success', 'Account created! Please log in.');
        res.redirect('/login');
    } catch (error) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/register');
    }
};

export { showRegistrationForm, processRegistration };