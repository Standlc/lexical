import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@lexical.app/server': path.resolve(__dirname, '../server/src/index.ts'),
            '@lexical.app/api-types': path.resolve(__dirname, '../packages/api-types/src/index.ts'),
            '@lexical.app/utils': path.resolve(__dirname, '../packages/utils/src/index.ts'),
            '@lexical.app/validators': path.resolve(__dirname, '../packages/validators/src/index.ts'),
        },
    },
});
