#!/bin/bash
yarn
$@ node src/crawl-paluch.js cat --pages-count 50
$@ node src/crawl-paluch.js dog --pages-count 50
