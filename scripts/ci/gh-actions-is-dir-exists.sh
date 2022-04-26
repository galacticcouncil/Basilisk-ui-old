#!/bin/bash

DIR=$1

DIR="./reporter-artifacts"
if [ -d "$DIR" ]; then
  echo true
else
  echo false
fi