#! /bin/bash

# given a pom, and a destination directory, create subdirectories DEST/VERSION/ARTIFACT_ID and copy a renamed version of the pom here
if [ "$#" -eq "1" ]; then
	echo "Usage: $0 destinationDir pom1 pom2 ...";
	exit 1;
fi

poms=${@:2}
destinationRootDir=$1
for pom in $poms; do
   (version=$(mvn -f $pom org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.version | grep -v '^[\[D]');
   versionDir=$(echo $version | sed -e 's/.*\([0-9]\{4\}\.[0-9]\{2\}\).*/\1/');
   artifact=$(mvn -f $pom org.apache.maven.plugins:maven-help-plugin:2.1.1:evaluate -Dexpression=project.artifactId | grep -v '^[\[D]');
   artifactDir=$artifact;
   echo "versionDir=$versionDir";
   echo "artifactDir=$artifactDir";

   newPomName=$artifact-$version.pom
   echo "newPomName=$newPomName";

   destinationDir=$destinationRootDir/$versionDir/$artifactDir;
   if [ ! -d $destinationDir ]; then
   	mkdir -p $destinationDir;
   fi

   cp $pom $destinationDir/$newPomName;) &
done

wait;
