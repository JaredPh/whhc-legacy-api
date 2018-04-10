#!/usr/bin/env bash

TRAVIS_BUILD_NUMBER=$1
TRAVIS_BRANCH=$2
AWS_ACCOUNT_ID=$3
AWS_REGION=$4
DOCKER_CONTAINER=$5
S3_BUCKET=$6
EB_APP=$7
EB_ENV=$EB_APP-$TRAVIS_BRANCH

VERSION=v$TRAVIS_BUILD_NUMBER.$TRAVIS_BRANCH

ZIP=Dockerrun.aws.${VERSION}.zip

docker --version
pip install --user awscli
export PATH=$PATH:$HOME/.local/bin
eval $(aws ecr get-login --region eu-west-1)

docker build -t $DOCKER_CONTAINER .
docker tag $DOCKER_CONTAINER $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$DOCKER_CONTAINER:$VERSION

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$DOCKER_CONTAINER:$VERSION

sed -i='' "s|<AWS_ACCOUNT_ID>|${AWS_ACCOUNT_ID}|" Dockerrun.aws.json
sed -i='' "s|<DOCKER_CONTAINER>|${DOCKER_CONTAINER}|" Dockerrun.aws.json
sed -i='' "s|<AWS_REGION>|${AWS_REGION}|" Dockerrun.aws.json
sed -i='' "s|<VERSION>|${VERSION}|" Dockerrun.aws.json

zip -r $ZIP Dockerrun.aws.json
aws s3 cp $ZIP s3://$S3_BUCKET/$ZIP

aws elasticbeanstalk create-application-version --region $AWS_REGION --application-name $EB_APP --version-label $VERSION --source-bundle S3Bucket=$S3_BUCKET,S3Key=$ZIP

aws elasticbeanstalk update-environment --region $AWS_REGION --environment-name $EB_ENV --version-label $VERSION