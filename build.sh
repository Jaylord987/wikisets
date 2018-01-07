#!/bin/bash

mkdir releases
pkg . --out-path releases

mkdir releases/macos
mkdir releases/win
mkdir releases/linux

mv releases/wikisets-macos releases/macos/wikisets
mv releases/wikisets-win.exe releases/win/wikisets.exe
mv releases/wikisets-linux releases/linux/wikisets

cp pkg-src/install.sh releases/macos/
cp pkg-src/uninstall.sh releases/macos/

cp pkg-src/install.sh releases/linux/
cp pkg-src/uninstall.sh releases/linux/

cp LICENSE releases/macos/
cp LICENSE releases/win/
cp LICENSE releases/linux/

zip -r releases/macos.zip releases/macos/
zip -r releases/win.zip releases/win/
zip -r releases/linux.zip releases/linux/