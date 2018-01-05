# `merge`

## Description
The `merge` command is used to merge manifest files either locally or from the web. By default, it'll first load the external manifest file by using the passed value as a system file path. Then, it'll merge the `articles` lists of the two manifest files and then preform a manifest sync (same as the `sync` command).

## Settings
### `--no-sync`
This blocks the manifest sync after the manifest files are merged.

### `-u, --url`
This treats the passed value as a URL, and uses the data at the given URL as the external manifest file.

## Usage
Merge with no settings passed: `merge "_external_set.json"`

Merge without a manifest sync: `merge "_external_set.json" --no-sync`

Merge by loading the external manifest from a URL: `merge "https://some.place.com/_external_set.json" -u`