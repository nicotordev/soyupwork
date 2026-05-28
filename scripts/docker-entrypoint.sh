#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "[entrypoint] Running prisma migrate deploy..."
  bunx prisma migrate deploy --schema=./prisma/schema.prisma
fi

exec bun server.js
