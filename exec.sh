#!/bin/bash
yarn
NODE_ENV=production node src/crawl-paluch.js cat --pages-count 50
NODE_ENV=production node src/crawl-paluch.js dog --pages-count 50
