#!/bin/sh

# Seed the database if using SQLite and the file doesn't exist
# Or just run migrations
npx prisma migrate deploy

# Start the application
node server.js
