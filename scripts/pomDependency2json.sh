#! /bin/bash

if [ $# -eq 0 ]; then
	echo "Usage: $0 POM_FILE";
fi

currentDir=$( cd "$(dirname "$0")" ; pwd -P );
poms=$@;

pomDir="$currentDir/../poms";
effectivePomDir="$currentDir/../poms/effective";
if [ ! -d $pomDir ]; then
	echo "creating pom directory: $pomDir";
	mkdir $pomDir;
fi
echo "pom directory: $pomDir"

for pom in $poms; do
    echo "creating effective pom for, $pom";
    pomBase=$( basename $pom );
	mvn -f $pom help:effective-pom -Doutput=$effectivePomDir/$pomBase &
done

wait; # wait for the effective poms to be created
echo "created effective poms"

