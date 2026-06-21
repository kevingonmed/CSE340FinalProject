import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { findUserByEmail } from '../../models/forms/registration.js';

const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'Login',
        errors: [],
        formData: {}
    });
};

const processLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('forms/login/form', {
            title: 'Login',
            errors: errors.array(),
            formData: req.body
        });
    }

    try {
        const { email, password } = req.body;
        const user = await findUserByEmail(email);
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
        req.session.user = {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            roleName: user.role_name
        };
        req.flash('success', `Welcome, ${user.first_name}!`);
        res.redirect('/dashboard');
    } catch (error) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};

export { showLoginForm, processLogin, processLogout };