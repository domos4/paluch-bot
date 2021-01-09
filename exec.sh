#!/bin/bash
#yarn
PGUSER=dominikchmielarz \
PGHOST=localhost \
PGPASSWORD=secretpassword \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/crawl-paluch.js cat --pages-count 1

PGUSER=dominikchmielarz \
PGHOST=localhost \
PGPASSWORD=secretpassword \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/crawl-paluch.js dog --pages-count 1
