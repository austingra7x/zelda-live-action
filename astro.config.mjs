import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  output: 'hybrid', // static pages + serverless API
  adapter: vercel(),
  integrations: [react()],
});
