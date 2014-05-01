#! /bin/bash

if [ $# -ne 1 ]; then
	echo "Usage: $0 POM_DIR";
	exit 1;
fi

pomDir=$1;
if [ ! -d $pomDir ]; then
	echo "POM directory does not exist: $pomDir";
	exit 1;
fi

printf "{\n";
printf "   \"poms\" : [\n";
# iterate through poms in for loop
count=0;
for pom in `ls -1 $pomDir/*.pom`; do
	if [ "$count" -ne "0" ]; then
		printf ",\n";
	fi
	pomName=$(basename $pom);
	printf "      {\"name\" : \"$pomName\"}";
	count=$(($count + 1));
done
printf "\n   ]\n";
printf "}";
