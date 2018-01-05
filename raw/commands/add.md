# `add`

## Description
The `add` command is used to add articles to your set. This means it'll download the article as well as add it to your manifest file. When used without passing any settings, the given query will be searched on Wikipedia, and the top result will be added into your set.

## Settings
### `-v, --verbatim`
Instead of searching the query and using the top result, the given article name will be used directly to get article content.

### `-m, --multi [limit]`
When using the passed query to search Wikipedia, instead of only using the top article's content, the top 10 result's content are used. This number can be upped or lowered by passing a limit value.

> *Note:* the verbatim and multi options can't both be passed at once

## Usage
Add an article: `add "lilias armstrong"`

Add an article, and use the passed article name verbatim: `add "lilias armstrong" -v`

Add the top 15 results from the passed query: `add "lilias armstrong" -m 15`