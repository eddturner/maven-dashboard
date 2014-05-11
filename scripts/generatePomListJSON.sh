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

#printf "{\n";
#printf "   \"poms\" : [\n";
# iterate through poms in for loop
#count=0;
#for pom in `ls -1 $pomDir/*.pom`; do
#	if [ "$count" -ne "0" ]; then
#		printf ",\n";
#	fi
#	pomName=$(basename $pom);
#	printf "      {\"name\" : \"$pomName\"}";
#	count=$(($count + 1));
#done
#printf "\n   ]\n";
#printf "}";

#for versionDir in `ls -d $pomDir/*/ | grep '[0-9]\{4\}\.[0-9]\{2\}'`; do
#	printf "versionDir = $versionDir\n";
#	for artifactDir in `ls -d $versionDir/*`; do
#		echo "artifactDir = $artifactDir"
#		for pom in `ls $artifactDir/*.pom`; do
#			echo "{ $versionDir, $artifactDir, $pom }";
#		done
#	done
#done;

printf "{\n";
printf "   \"versions\" : [\n";
vCount=0;
for versionDir in `ls -l $pomDir | grep '^d' | awk '{print $9}' | grep '[0-9]\{4\}\.[0-9]\{2\}'`; do
	if [ "$vCount" -ne "0" ]; then
                printf ",\n";
        fi
	printf "      {\n";
	printf "         \"version\" : \"$versionDir\",\n";
	printf "         \"artifacts\" : [\n";
	aCount=0;
	for artifactDir in `ls -l $pomDir/$versionDir | grep '^d' | awk '{print $9}'`; do
		if [ "$aCount" -ne "0" ]; then
               		printf ",\n";
        	fi
		printf "            {\n";
		printf "               \"artifact\" : \"$artifactDir\",\n";
		printf "               \"poms\" : [\n";
		pCount=0;
		for pom in `ls -l $pomDir/$versionDir/$artifactDir/$artifactDir*.pom 2>/dev/null | awk '{print $9}'`; do
			if [ "$pCount" -ne "0" ]; then
               			printf ",\n";
        		fi
			pomPath=$( greadlink -f $pom );
			pomName=$( basename $pom );
			printf "                  {\"name\" : \"$pomName\", \"path\" : \"$pomPath\"}";
			pCount=$(($pCount + 1));
		done
		printf "\n               ]\n";
		printf "            }";
		aCount=$(($aCount + 1));
	done
	printf "\n         ]\n";
	printf "      }";
	vCount=$(($vCount + 1));
done
printf "\n   ]\n";
printf "}\n";

#<(find ../poms/*/*/*.pom -type f | sed -e 's/^..\/poms\/\([0-9]\{4\}\.[0-9]\{2\}\)\/\(.*\)\/\(.*\.pom\)$/{ \"version\" : \"\1\", \"artifact\" : \"\2\", \"name\" : \"\3\" }/')
