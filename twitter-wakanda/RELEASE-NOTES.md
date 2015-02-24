#Release Notes#

This Document include release notes of:

* [The current NG-Wakanda-Pack release notes](#ng-wakanda-pack-release-notes)
* [The embedded angular-wakanda connector service module release notes](#angular-wakanda-release-notes)

The embedded version of the angular-wakanda connector service module release notes only contains updates with impacts on the package. The original version include more notes regarding internal untit tests.


##NG-Wakanda-Pack Release Notes##

This pre-version of the [NG-Wakanda Pack](https://github.com/AMorgaut/NG-Wakanda-Pack) is based on alpha releases of **angular-wakanda** which notes are available in the next section.

###[v0.4.4](https://github.com/AMorgaut/NG-Wakanda-Pack/releases/tag/v0.4.4)

* Project structure update
* Removal of the ios demo (in favor to a future better one)
* Switch the Model definiton of Country/Company/Employee in SSJS indtead of JSON  
* Update the main tutorial to show the new Dataclass source files and new tabs for calculated attributes
* Update the angular-wakanda API Documentation
* update to **angular-wakanda version 0.3.0**
* update related tutorial steps and demos

###[v0.3.0](https://github.com/AMorgaut/NG-Wakanda-Pack/releases/tag/v0.3.0)

* update to **angular-wakanda version 0.2.0**
* remove alternative code required for previous versions
* fix demo.js

###[v0.2.6](https://github.com/AMorgaut/NG-Wakanda-Pack/releases/tag/v0.2.6)

* update to **angular-wakanda version 0.0.11**
* remove alternative code required for previous versions

###[v0.2.5](https://github.com/AMorgaut/NG-Wakanda-Pack/releases/tag/v0.2.5)

* update to **angular-wakanda version 0.0.10**
* remove alternative code required for previous versions

##Angular-Wakanda  Release Notes##

Understand this module is still under development and the current releases are alpha versions.

The versions provided can be unstable, the features may not be finished. I'll try to keep this document up to date (it may not be completly accurate).

###v0.3.0
* changed filename from `angular-wakanda-connector.*` to `angular-wakanda.*`
* changed module name from `wakConnectorModule` to `wakanda`
* changed service name from `wakConnectorService` to `$wakanda`

###v0.2.0
* added **directory API** support

###v0.1.1
* nestedCollections :
	* added `$totalCount`
	* better `$query()`
	* `$fetch()` more stable
	* added `$more()`, `$nextPage()`, `$prevPage()`

###v0.1.0
* `$find()` accepts empty params
* refactored `$fetch()` on nested collections (still under dev)
* `$findOne(id, options)` - added `options` param (like in `$find()`)

###v0.0.11

* added `$fetch()`, `$toJSON()`, $isLoaded on nested collection
* integrated patch on error between null and `$_deferred` (undefined)

###v0.0.10

* fixed another "Converting circular structure to JSON" bug in `.$toJSON()` method

###v0.0.9

* fixed "Converting circular structure to JSON" bug in `.$toJSON()` method

###v0.0.8

* `$fetch()` on deferred entities (not yet on collections)
* `$isLoaded()` method (makes it easier to check if your entity/collection was fetched or not)
* user defined collection method at the root of your collection (not on the nested ones)
* added `.$toJSON()` on entities and root collections (not yet on the nested ones)

###v0.0.7

* added calculated attributes
* 1>n relationships (no deffered, no collection methods)

###v0.0.6

* bug fix on undefined object

###v0.0.5

* added photo `src` retrieving support

###...
