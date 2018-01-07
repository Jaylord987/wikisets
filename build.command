#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

mkdir releases
pkg . --out-path releases

mkdir releases/macos
mkdir releases/win
mkdir releases/linux

mv releases/wikisets-macos releases/macos/wikisets
mv releases/wikisets-win.exe releases/win/wikisets.exe
mv releases/wikisets-linux releases/linux/wikisets

cp pkg-src/install.command releases/macos/
cp pkg-src/uninstall.command releases/macos/

cp pkg-src/install.command releases/linux/
cp pkg-src/uninstall.command releases/linux/

cp LICENSE releases/macos/
cp LICENSE releases/win/
cp LICENSE releases/linux/

cp pkg-src/README.txt releases/macos/
cp pkg-src/README.txt releases/win/
cp pkg-src/README.txt releases/linux/

zip -r releases/macos.zip releases/macos/
zip -r releases/win.zip releases/win/
zip -r releases/linux.zip releases/linux/