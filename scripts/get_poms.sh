#! /bin/bash


repos="interfaces storage"
currentDir=$(pwd)
pomDir="$currentDir/../poms";
if [ ! -d $pomDir ]; then
	echo "creating pom directory: $pomDir";
	mkdir $pomDir;
fi

echo "pom directory: $pomDir"
cd $pomDir
for repo in $repos; do
	echo "Fetching poms for $repo"
	for pomInfo in `curl --user dev:uniprot http://wwwdev.ebi.ac.uk/uniprot/artifactory/api/search/gavc?a=$repo\&repos=release 2>/dev/null | grep ".pom" | sed -e 's/.*\(http.*\.pom\).*/\1/'`; do
		pomURL=`curl --user dev:uniprot $pomInfo 2>/dev/null | grep downloadUri | sed -e 's/.*\(http.*\.pom\).*/\1/'`
		echo "downloading $pomURL"
		curl --user dev:uniprot -O $pomURL 2>/dev/null
	done
done

ls -l | grep ".*\.pom"
if [ $? -ne 0 ]; then
	echo "no poms downloaded -- exiting";
	exit 0;
fi
pomCount=`ls -l | grep ".*\.pom" | wc -l`
echo "downloaded $pomCount poms"

cd $currentDir


