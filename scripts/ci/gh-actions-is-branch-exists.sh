#!/bin/bash

BRANCH=$1

EXISTED_IN_REMOTE=$(git ls-remote --heads origin "$BRANCH")

if [[ -z ${EXISTED_IN_REMOTE} ]]; then
    echo false
else
    echo true
fi