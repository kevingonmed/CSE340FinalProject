import { body } from 'express-validator';

const groupTypes = ['solo', 'couple', 'family', 'friends'];
const vibes = ['adventure', 'relax', 'culture', 'food', 'nature'];

const tripValidation = [
    body('homeCity').trim().notEmpty().withMessage('Home city is required')
        .isLength({ max: 100 }).withMessage('Home city is too long'),
    body('budget').trim().notEmpty().withMessage('Budget is required')
        .isFloat({ gt: 0, max: 1000000 }).withMessage('Budget must be a valid positive number')
        .toFloat(),
    body('travelDates').trim().notEmpty().withMessage('Travel dates are required')
        .isLength({ max: 100 }).withMessage('Travel dates are too long'),
    body('groupType').trim().notEmpty().withMessage('Group type is required')
        .isIn(groupTypes).withMessage('Select a valid group type'),
    body('vibe').trim().notEmpty().withMessage('Vibe is required')
        .isIn(vibes).withMessage('Select a valid vibe')
];

export { tripValidation, groupTypes, vibes };
