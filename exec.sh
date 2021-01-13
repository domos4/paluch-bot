#!/bin/bash
#yarn
PGUSER=dominikchmielarz \
PGHOST=localhost \
PGPASSWORD=secretpassword \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/save-new-pets-and-notify.js cat --pages-count 1

PGUSER=dominikchmielarz \
PGHOST=localhost \
PGPASSWORD=secretpassword \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/save-new-pets-and-notify.js dog --pages-count 1
