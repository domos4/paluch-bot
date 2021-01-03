#!/bin/zsh
yarn
NODE_ENV=production node src/crawl-paluch.js dog --pages-count 1
NODE_ENV=production node src/crawl-paluch.js cat --pages-count 1
