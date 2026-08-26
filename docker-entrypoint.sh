#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-postgresql://root@127.0.0.1:26257/defaultdb?sslmode=disable}"

if [ "${SKIP_EMBEDDED_COCKROACH:-}" != "true" ]; then
  mkdir -p /tmp/cockroach-data

  cockroach start-single-node \
    --insecure \
    --listen-addr=127.0.0.1:26257 \
    --advertise-addr=127.0.0.1:26257 \
    --http-addr=127.0.0.1:8080 \
    --store=/tmp/cockroach-data \
    --cache=64MiB \
    --max-sql-memory=128MiB \
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

npx prisma migrate deploy
npx prisma db seed
exec node dist/main
