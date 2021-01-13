#!/bin/bash

PGHOST=localhost \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/save-new-pets-and-notify.js cat --pages-count 1 --verbose

PGHOST=localhost \
PGDATABASE=napaluchu \
PGPORT=5432 \
$@ \
node src/save-new-pets-and-notify.js dog --pages-count 1 --verbose
