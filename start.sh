#!/bin/bash
/usr/local/bin/wait-for-it.sh api-image-reading:5432 --timeout=60 -- echo "Database is up"

npx prisma migrate deploy
npx prisma generate

npm run build

npm start