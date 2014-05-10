#! /bin/bash

if [ $# -eq 0 ]; then
	echo "Usage: $0 POM_FILES";
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
    thisPomDir=$( dirname $( greadlink -f $pom ) );
    echo $pomBase;    
echo $thisPomDir;
	(mvn -f $pom org.apache.maven.plugins:maven-dependency-plugin:2.4:tree -DoutputType="graphml" -DoutputFile=$thisPomDir/$pomBase.graphml) &
	(mvn -f $pom help:effective-pom -Doutput=$thisPomDir/$pomBase-effective;
	 sed -i '' -e 's/^<!--.*-->$//' -e '/^[ \t]*$/d' $thisPomDir/$pomBase-effective;) &
done
wait; # wait for the effective poms to be created

#cd $effectivePomDir;
#for ePom in $poms; do
#	sed -i '' -e 's/^<!--.*-->$//' -e '/^[ \t]*$/d' $ePom &
#done
#wait; # wait for effective poms to be cleaned up a little
#cd ..;

echo "created effective poms"

