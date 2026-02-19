// Custom lightweight validation middleware
// No dependencies required

const validate = (schema) => {
    return (req, res, next) => {
        const data = req.body;
        const errors = [];
        const validatedData = {};

        // Only validate what's in the schema
        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];

            // Required check
            if (rules.required && (value === undefined || value === null || value === '')) {
                errors.push(`${field} is required`);
                continue;
            }

            if (value !== undefined && value !== null) {
                // Type check
                if (rules.type && typeof value !== rules.type) {
                    errors.push(`${field} must be a ${rules.type}`);
                    continue;
                }

                // Min length check
                if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
                    errors.push(`${field} must be at least ${rules.minLength} characters`);
                    continue;
                }

                // Max length check
                if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
                    errors.push(`${field} must not exceed ${rules.maxLength} characters`);
                    continue;
                }

                // Pattern check (regex)
                if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
                    errors.push(`${field} format is invalid`);
                    continue;
                }

                // Sanitization & Storage
                validatedData[field] = typeof value === 'string' ? value.trim() : value;
            }
        }

        if (errors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        // Replace body with validated data (strips unknown fields)
        req.body = validatedData;
        next();
    };
};

module.exports = validate;
