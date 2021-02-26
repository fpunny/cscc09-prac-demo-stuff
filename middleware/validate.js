const validatorError = res => (status, payload) => {
    if (typeof payload === `string`) {
        payload = [ payload ];
    }

    res.status(status);
    res.json({
        status: `error`,
        errors: payload,
    });
    res.end();
};

const validate = {
    string: async (config, field, value) => {
        if (typeof value !== `string`) {
            throw `${field} is not of type string`;
        }

        if (config.$enum && !config.$enum.includes(value)) {
            throw `${field} is not one of [${config.$enum.join(', ')}]`;
        }

        if (config.$validate) {
            await config.$validate(value);
        }

        // Add more as needed
    },
    // Add more as needed
};

const bodyValidator = (schema, options = {}) => {
    const keys = Object.keys(schema);
    const requiredFields = keys.filter(key => schema[key].$required);

    return async (req, res, next) => {
        const reqBody = req.body || {};
        const throwError = validatorError(res);
        const fields = Object.keys(reqBody);

        // Validate structure of body
        if (options.strict) {
            const extraFields = fields.filter(field => !keys.includes(field));
            if (extraFields.length) {
                return throwError(422, `Extra fields [${extraFields.join(', ')}] are not allowed`);
            }
        }

        // Validate required fields
        const missingFields = requiredFields.filter(field => !fields.includes(field));
        if (missingFields.length) {
            return throwError(422, `Missing fields [${missingFields.join(', ')}]`);
        }

        // Validate fields
        const results = await Promise.allSettled(fields.map(async field => {
            const fieldConfig = schema[field];
            if (!fieldConfig) return;

            await validate[fieldConfig.$type](fieldConfig, field, reqBody[field]);
        }));

        const errors = results
            .filter(result => result.status === `rejected`)
            .map(err => err.reason)
        ;

        if (errors.length) {
            return throwError(422, errors);
        }

        next();
    };
};

module.exports = schema => {
    if (!schema || typeof schema !== `object`) {
        throw new Error(`Missing schema for validator`);
    }

    if (schema.body) {
        const hasUnknownType = Object.values(schema.body).filter(
            ({ $type }) => !validate[$type],
        );

        if (hasUnknownType.length) {
            throw new Error(`The following types [${hasUnknownType.join(', ')}] are not valid. Did you forget to register it?`);
        }

        return bodyValidator(schema.body, schema.options);
    }
};