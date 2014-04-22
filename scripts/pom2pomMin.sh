#! /bin/bash

if [ $# -ne 1 ]; then
	echo "Usage: $0 POM_FILE";
fi

pom=$1
cat $pom | tr '\n' ' ' | sed 's/[ \t]//g' > $pom.min
