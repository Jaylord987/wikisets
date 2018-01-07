#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

sudo cp ./wikisets /usr/local/bin/
sudo chmod +x /usr/local/bin/wikisets
echo "Wikisets Installed"