#!/bin/bash

set +x

docker build -t ng-equation .
docker run -t ng-equation
