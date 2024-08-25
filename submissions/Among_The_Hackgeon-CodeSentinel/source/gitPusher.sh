#!/bin/bash

if [ -z "$1" ]; then
    echo -e "\033[31mNo commit message provided.\033[0m"
    exit 1
fi

git add --all
git commit -m "$1"
git push -u origin master               #This addition also clear all outpur from git push:     > /dev/null 2>&1 

repoUrl=$(git config --get remote.origin.url)
commitHash=$(git log -1 --pretty=format:"%H")
commitUrl=$(echo "$repoUrl" | sed 's/\.git$/\/commit\/'"$commitHash"'/')

echo "Commit: $commitUrl"
