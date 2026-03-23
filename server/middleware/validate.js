// ─── VALIDATION MIDDLEWARE ─────────────────────────────────────────────────────
// Lecture 25-28: Middleware lifecycle — input validation with express-validator
//
// validateBody(rules) is a higher-order function that:
//   1. Runs the validation rules (an array of express-validator chains)
//   2. Checks for errors via validationResult()
//   3. Returns 422 with structured errors if validation fails
//   4. Calls next() if everything passes
//
// Usage in routes:
//   const { body } = require('express-validator');
//   router.post('/', validateBody([
//     body('title').notEmpty().withMessage('title is required'),
//     body('type').notEmpty().withMessage('type is required'),
//   ]), handler);

const { validationResult } = require('express-validator');

const validateBody = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
        requestId: req.id || null,
      });
    }
    next();
  },
];

module.exports = { validateBody };
