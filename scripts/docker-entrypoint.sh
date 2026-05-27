#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
  echo "[entrypoint] Running prisma migrate deploy..."
  bunx prisma migrate deploy
fi

exec bun server.js
