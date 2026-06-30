#!/usr/bin/env bash
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

echo "==> Starting backup $TIMESTAMP"

# PostgreSQL
PG_CONN="${DATABASE_URL:-postgres://koko:koko_dev@localhost:5432/koko}"
pg_dump "$PG_CONN" | gzip > "$BACKUP_DIR/koko_db_$TIMESTAMP.sql.gz"
echo "Database backed up."

# Redis
redis-cli -u "${REDIS_URL:-redis://localhost:6379}" SAVE
echo "Redis snapshot saved."

# S3 (if configured)
if [ -n "${S3_BUCKET:-}" ]; then
  aws s3 sync s3://"$S3_BUCKET" "$BACKUP_DIR/s3_$TIMESTAMP/" --no-follow-symlinks
  echo "S3 bucket synced."
fi

echo "==> Backup complete: $BACKUP_DIR/koko_db_$TIMESTAMP.sql.gz"
