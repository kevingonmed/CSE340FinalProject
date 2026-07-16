import { body } from 'express-validator';

const groupTypes = ['solo', 'couple', 'family', 'friends'];
const vibes = ['adventure', 'relax', 'culture', 'food', 'nature'];

const tripValidation = [
    body('homeCity').trim().notEmpty().withMessage('Home city is required')
        .isLength({ max: 100 }).withMessage('Home city is too long'),
    body('budget').trim().notEmpty().withMessage('Budget is required')
        .isFloat({ gt: 0, max: 1000000 }).withMessage('Budget must be a valid positive number')
        .toFloat(),
    body('groupType').trim().notEmpty().withMessage('Group type is required')
        .isIn(groupTypes).withMessage('Select a valid group type'),
    body('vibe').trim().notEmpty().withMessage('Vibe is required')
        .isIn(vibes).withMessage('Select a valid vibe'),
    body('startDate').notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Start date must be valid'),
    body('endDate').notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('End date must be valid')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date must be on or after start date');
            }
            return true;
        }),
];

export { tripValidation, groupTypes, vibes };
