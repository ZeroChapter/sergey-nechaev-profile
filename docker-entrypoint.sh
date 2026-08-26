#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-postgresql://root@127.0.0.1:26257/defaultdb?sslmode=disable}"
export PORT="${PORT:-3000}"
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=128}"

if [ "${SKIP_EMBEDDED_COCKROACH:-}" != "true" ]; then
  mkdir -p /tmp/cockroach-data

  export GOMAXPROCS="${GOMAXPROCS:-1}"
  export GOGC="${GOGC:-30}"
  export COCKROACH_SKIP_ENABLING_DIAGNOSTIC_REPORTING=true

  cockroach start-single-node \
    --insecure \
    --listen-addr=127.0.0.1:26258 \
    --advertise-addr=127.0.0.1:26258 \
    --sql-addr=127.0.0.1:26257 \
    --http-addr=127.0.0.1:8080 \
    --store=/tmp/cockroach-data \
    --cache=32MiB \
    --max-sql-memory=64MiB \
    --background
fi

exec node dist/src/main.js
