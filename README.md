# Wikisets

#### Relevant, Offline Wikipedia Article Manager

[![npm](https://img.shields.io/npm/v/wikisets.svg)](https://www.npmjs.com/package/wikisets)
[![GitHub commits](https://img.shields.io/github/commits-since/alexwaitz/wikisets/1.1.0-alpha.svg)](https://github.com/alexwaitz/wikisets)
[![npm](https://img.shields.io/npm/l/wikisets.svg)](https://www.npmjs.com/package/wikisets)

# What?

Wikisets is a CLI based application. It's purpose is to make it easy to get relevant Wikipedia articles offline.

Traditionally, Wikipedia is kept offline with applications such as [Kiwix](http://www.kiwix.org/) or [XOWA](http://xowa.org/). While both of these programs do their job well, sometimes downloading *all* of Wikipedia at once either isn't feasible, or efficent. Commonly, people only want to use less than 1% of that downloaded data, making a applications that can only download all at a time inefficent time and storage wise.

With Wikisets, this problem is solved. With a manifest based model, Wikisets allows you to create "sets", each of which hold a manifest in which a set's meta data, including name, description, and a list of articles. This way, you can add and store offline all the articles you want. Furthermore, there are tools which enable the merging of other manifests into your main, giving you the ability share and expand your set with others, ultimately increasing coverage of your *desired* articles.

# *Please Note*

Both in this branch and the dev, there will be be continual and sometimes major changes, as this is still in alpha. The library will certainly experience many changes and updates, so be weary when using it. However, the command line application will not experience any large changes, only very minor ones, so feel free to download and use it.

Also! A GUI is being written for Wikisets! It's called Soda, and can be found [here](https://github.com/alexwaitz/soda).

# Get started

Wikisets can also be installed with NPM or Yarn:

NPM: `npm install -g wikisets`

Yarn: `yarn global add wikisets`

To run the program, simply type in `wikisets` in the desired directory. After the application begins, typing `help` will provide a list of commands.

# Contact
If you have any questions, comments, or concerns, send me an email at [alexanderjwaitz@gmail.com](mailto:alexanderjwaitz@gmail.com)