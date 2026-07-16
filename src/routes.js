import express from 'express';
import { showLoginForm, processLogin, processLogout } from './controllers/forms/login.js';
import { showRegistrationForm, processRegistration } from './controllers/forms/registration.js';
import { showDashboard } from './controllers/dashboard.js';
import { showNewTripForm, processNewTrip, showTrip } from './controllers/trips.js';
import { showAdminDashboard } from './controllers/admin.js';
import { requireLogin, requireRole } from './middleware/auth.js';
import { loginValidation, registrationValidation } from './middleware/validation/forms.js';
import { tripValidation } from './middleware/validation/trips.js';

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
router.get('/trips/new', requireLogin, showNewTripForm);
router.post('/trips/new', requireLogin, tripValidation, processNewTrip);
router.get('/trips/:id', requireLogin, showTrip);
router.get('/admin', requireLogin, requireRole('admin'), showAdminDashboard);

export default router;