#!/usr/bin/env bash

docker --version
pip install --user awscli
export PATH=$PATH:$HOME/.local/bin
eval $(aws ecr get-login --region eu-west-1) #needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY envvars
docker build -t whhc/api .
docker tag whhc/api:latest 519891319653.dkr.ecr.eu-west-1.amazonaws.com/whhc/api:latest
docker push 519891319653.dkr.ecr.eu-west-1.amazonaws.com/whhc/api:latest