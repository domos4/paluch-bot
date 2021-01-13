#!/bin/bash
#yarn
PGUSER=dominikchmielarz \
PGHOST=localhost \
PGPASSWORD=secretpassword \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/save-new-pets-and-notify.js cat --pages-count 50 --verbose

PGUSER=dominikchmielarz \
PGHOST=localhost \
PGPASSWORD=secretpassword \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/save-new-pets-and-notify.js dog --pages-count 50 --verbose
