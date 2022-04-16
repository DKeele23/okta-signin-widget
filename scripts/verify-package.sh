#!/bin/bash

source $OKTA_HOME/$REPO/scripts/setup.sh

export PATH="${PATH}:$(yarn global bin)"
export TEST_SUITE_TYPE="build"

# Build
if ! yarn build:release; then
  echo "build failed! Exiting..."
  exit ${TEST_FAILURE}
fi

mkdir -p test-reports

pushd dist
npm pack --dry-run --json > ../test-reports/pack-report.json
popd

if ! node ./scripts/buildtools verify-package 2>&1 | tee target/out.log
then
  value=`tail -12 target/out.log`
  log_custom_message "${value}"
  echo "verification failed! Exiting..."
  exit ${TEST_FAILURE}
fi
