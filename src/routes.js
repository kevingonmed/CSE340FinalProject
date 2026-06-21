import express from 'express';
import { showLoginForm, processLogin, processLogout } from './controllers/forms/login.js';
import { showRegistrationForm, processRegistration } from './controllers/forms/registration.js';
import { showDashboard } from './controllers/dashboard.js';
import { requireLogin } from './middleware/auth.js';
import { loginValidation, registrationValidation } from './middleware/validation/forms.js';

const router = express.Router();

// Home
router.get('/', (req, res) => res.render('home', { title: 'WanderDecide — AI Trip Decider' }));

// Auth
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);
router.get('/logout', processLogout);

// Dashboard (protected)
router.get('/dashboard', requireLogin, showDashboard);

export default router;