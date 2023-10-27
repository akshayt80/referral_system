#!/bin/bash

echo "db init";
yarn db:init;

echo "starting server";
yarn start
