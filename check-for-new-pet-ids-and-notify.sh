#!/bin/zsh
NODE_ENV=production node src/crawl-paluch.js dog --preserve-data --verbose --pages-count 1
NODE_ENV=production node src/crawl-paluch.js cat --preserve-data --verbose --pages-count 1
