#!/bin/bash
# ==============================================
# Morocco Desert Riders - Database Backup Script
# ==============================================
# 
# Setup cron job (daily at 2 AM):
# 0 2 * * * /home/username/api/scripts/backup-database.sh
#
# Make executable: chmod +x backup-database.sh

# ==============================================
# Configuration - UPDATE THESE VALUES
# ==============================================
DB_USER="your_cpanel_dbuser"
DB_PASSWORD="your_db_password"
DB_NAME="your_cpanel_dbname"
BACKUP_DIR="/home/username/backups"
RETENTION_DAYS=30

# ==============================================
# Script - Do not modify below
# ==============================================

# Create backup directory if not exists
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"
COMPRESSED_FILE="${BACKUP_FILE}.gz"

# Log file
LOG_FILE="${BACKUP_DIR}/backup.log"

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo "$1"
}

log "Starting database backup..."

# Perform backup
if mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE" 2>/dev/null; then
    log "Database dump successful: $BACKUP_FILE"
    
    # Compress backup
    if gzip "$BACKUP_FILE"; then
        log "Compression successful: $COMPRESSED_FILE"
        
        # Get file size
        SIZE=$(du -h "$COMPRESSED_FILE" | cut -f1)
        log "Backup size: $SIZE"
    else
        log "ERROR: Compression failed"
    fi
else
    log "ERROR: Database dump failed"
    exit 1
fi

# Clean up old backups
log "Cleaning up backups older than $RETENTION_DAYS days..."
DELETED=$(find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete -print | wc -l)
log "Deleted $DELETED old backup(s)"

log "Backup completed successfully!"

# Optional: Send email notification
# echo "Database backup completed: $COMPRESSED_FILE ($SIZE)" | mail -s "Morocco DR Backup Success" admin@yourdomain.com
