#! /bin/bash

# given a pom, and a destination directory, create subdirectories DEST/VERSION/ARTIFACT_ID and copy a renamed version of the pom here
if [ "$#" -ne "2" ]; then
	echo "Usage: $0 pom destinationDir";
	exit 1;
fi

pom=$1
destinationRootDir=$2
version=$(mvn -o -f $pom org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.version | grep -v '^\[');
versionDir=$(echo $version | sed -e 's/.*\([0-9]\{4\}\.[0-9]\{2\}\).*/\1/');
artifact=$(mvn -o -f $pom org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.artifactId | grep -v '^\[');
artifactDir=$artifact;
echo $versionDir;
echo $artifactDir;

newPomName=$artifact-$version.pom
echo $newPomName;

destinationDir=$destinationRootDir/$versionDir/$artifactDir;
if [ ! -d $destinationDir ]; then
	mkdir -p $destinationDir;
fi

cp $pom $destinationDir/$newPomName;
