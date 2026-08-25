const { defineConfig } = require('@prisma/config');

module.exports = defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/busola',
  },
});
