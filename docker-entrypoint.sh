#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-postgresql://root@127.0.0.1:26257/defaultdb?sslmode=disable}"

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
    --max-sql-memory=32MiB \
    --background

  i=0
  until cockroach sql --insecure --host=127.0.0.1 --port=26257 -e 'SELECT 1' >/dev/null 2>&1; do
    i=$((i + 1))
    if [ "$i" -gt 60 ]; then
      echo "CockroachDB did not become ready"
      exit 1
    fi
    sleep 1
  done
fi

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=128}"
./node_modules/.bin/prisma migrate deploy
node dist/seed.js
exec node dist/main
