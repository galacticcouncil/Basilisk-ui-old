#!/bin/bash
# Sanitize $STRING for a container name
STRING=$1

# first, strip underscores
CLEAN=${STRING//_/-}
# next, replace spaces with underscores
CLEAN=${CLEAN// /_}
# now, clean out anything that's not alphanumeric or an underscore
CLEAN=${CLEAN//[^a-zA-Z0-9_-]/}
# finally, lowercase with TR
CLEAN=`echo -n $CLEAN | tr A-Z a-z`

echo $CLEAN