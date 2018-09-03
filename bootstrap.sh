#!/bin/bash

if [[ $EUID -ne 0 ]]; then
  echo "The bootstrap script requires sudo"
  exit 1
fi

if [[ -d /var/lufoodwatch ]]; then
  echo "LUFoodWatchServer already installed."
  echo "To reinstall, please run '/var/lufoodwatch/scripts/uninstall', then run this script again."
  exit 0
fi

# git clone --depth 1 --single-branch https://github.com/thislooksfun/lufoodwatchserver.git /var/lufoodwatch
cp -r /Users/simon/Desktop/Programming/Node/LUFoodWatchServer /var/lufoodwatch

cd -P /var/lufoodwatch/scripts

./install