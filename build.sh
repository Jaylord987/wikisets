#!/bin/bash

mkdir releases
pkg . --out-path releases

mkdir releases/macos
mkdir releases/win
mkdir releases/linux

mv releases/wikisets-macos releases/macos
mv releases/wikisets-win.exe releases/win
mv releases/wikisets-linux releases/linux

cp pkg-src/install.sh releases/macos/
cp pkg-src/uninstall.sh releases/macos/

cp pkg-src/install.sh releases/linux/
cp pkg-src/uninstall.sh releases/linux/

zip -r releases/macos.zip releases/macos/
zip -r releases/win.zip releases/win/
zip -r releases/linux.zip releases/linux/