#! /bin/bash

versions='';
if [ "$#" -ne "0" ]; then
    versions=$@;
fi

for version in $versions; do
    grep '^[0-9]\{4\}\.[0-9]\{2\}$' <(echo $version) > /dev/null 2>&1;
    if [ "$?" -eq "1" ]; then
        echo "specified version, $version, should be of the form NNNN.NN";
        exit 1;
    fi
done

repos="interfaces model parser storage util"
currentDir=$( cd "$(dirname "$0")" ; pwd -P );
pomDir="$currentDir/../poms";
if [ ! -d $pomDir ]; then
	echo "creating pom directory: $pomDir";
	mkdir $pomDir;
fi

echo "pom directory: $pomDir"
cd $pomDir
downloadCount=0;
for repo in $repos; do
	echo "---- fetching poms for $repo ----"
	for pomInfo in `curl --user dev:uniprot http://wwwdev.ebi.ac.uk/uniprot/artifactory/api/search/gavc?a=$repo\&repos=release 2>/dev/null | grep ".pom" | sed -e 's/.*\(http.*\.pom\).*/\1/'`; do
		valid=false;

		if [ "$#" -eq "0" ]; then
            valid=true;
        fi

		for version in $versions; do
            echo $pomInfo | grep $version > /dev/null 2>&1;
            if [ "$?" -eq "0" ]; then
                valid=true;
            fi
        done

        if [ "$valid" = true ]; then
		    pomURL=`curl --user dev:uniprot $pomInfo 2>/dev/null | grep downloadUri | sed -e 's/.*\(http.*\.pom\).*/\1/'`;
            echo "downloading $pomURL";
            curl --user dev:uniprot -O $pomURL 2>/dev/null;
            downloadCount=$(($downloadCount + 1));
        fi

	done
done

#ls -l | grep ".*\.pom"
if [ $? -ne 0 ]; then
	echo "no poms downloaded -- exiting";
	exit 0;
fi
pomCount=`ls -l | grep ".*\.pom" | wc -l`
echo "newly downloaded poms: $downloadCount";
echo "poms in directory $pomDir: $pomCount";

cd $currentDir


