#!/bin/zsh
node src/crawl-paluch.js dog --preserve-data --verbose --pages-count 30
node src/crawl-paluch.js cat --preserve-data --verbose --pages-count 30
