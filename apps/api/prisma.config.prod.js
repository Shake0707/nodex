// Used only inside Docker production container (no TypeScript runtime needed).
// apps/api/prisma.config.ts is used for local development.
const { defineConfig } = require('prisma/config');

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
