# Initial Database Migration

Initial database migration is achieved as followed:

Locate the thnx.sql backup taken from the legacy database. 

1. run the shell file 1.prepare_sql_file.sh:

    1.prepare_sql_file.sh path/to/thnx.sql
    
2. Manually open converted.sql and perform the following vim command (Will remove this once I fix above script)

    :%s/,\n);/);/g

3. Ensure database.yml is pointing to the right database

    2.migrate_legacy_data.sh 'db-name-in-database.yml'

