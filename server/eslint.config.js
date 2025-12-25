import rootConfig from '../eslint.config.mjs';

export default [
    ...rootConfig,
    {
        files: ['**/*.{ts,js}'],
        rules: {
            // Backend-specific rules can go here
        },
    },
];
