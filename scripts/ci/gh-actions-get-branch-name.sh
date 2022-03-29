#!/bin/bash

GH_EVENT_NAME=$1
GH_REF=$2
GH_BASE_REF=$3

if [[ $GH_EVENT_NAME = 'push' ]]
then
  echo "${GH_REF#refs/heads/}"
elif [[ $GH_EVENT_NAME = 'pull_request' ]]
then
  echo "$GH_BASE_REF"
else
  echo "${GH_REF#refs/heads/}"
fi