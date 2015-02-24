
# Angular-Wakanda API Documentation


## Warning

**BEWARE THIS IS EXPERIMENTAL**

**All this API is experimental. Don't hesitate to create issues to make suggestions.**


All async methods return a promise 

*Developers **don't have to call** <code>$scope.$apply()</code> when using an async methods of **angular-wakanda**. Either it is done transparently, either the `$scope` is passed as parameter to the callback.*



## Wakanda Service API

### Initialization

####Script Insertion

The Angular-Wakanda connector must of course be loaded in the html. 
The most classic way is to add it manually:

```html
<script src="myScriptPath/angular-wakanda.min.js"></script>
```

This can also be done using [Bower](http://bower.io)

```
bower install angular-wakanda
```

####Angular Module Loading

The next step, as for any angular module, is to be sure to load the Wakanda service 

```javascript
angular.module('MyApp', ['wakanda']);
```

#### init()

The `init()` method load a proxy of the Wakanda Model in the Angular application. As all **angular-wakanda** async methods it returns a Promise. It is possible to specify which DataClass should be loaded, otherwise, by default, all will be loaded.

```javascript
// Load all the Data Model
// A promise is returned which callback receive the Wakanda Datastore proxy
$wakanda.init().then(function (ds) {
	// use the datastore 
}); 

// Specify which dataClasses to load
$wakanda.init('Product', 'Person'); 

// Get the datastore object
// throw an exception if init has not been called or the promise hasn't resolved yet. 
// Exception explains steps to configure the service.
$wakanda.getDatastore(); 
```

The developer can have an already fulfilled service by adding a resolve function in it's routeProvider.

**Note:**

*Even if you are going to query for data from a single Dataclass only, because of alias and navigation attributes, you may have to load some related Dataclasses too.*


### getDataStore()

All loaded dataclasses are accessible via the Datastore Object delivered by the init Promise callback parameter or the <code>getDataStore()</code> method


```javascript
var Product = $wakanda.getDatastore().Product
```


### $login() / $logout()


To get the required permissions to use the Wakanda DataClass, it is often required to be authenticated. The Wakanda backend has a native directory and can handle custom authentications to custom or remote directories.

**angular-wakanda** expose a standard API to login and logout from the frontend.

```javascript
// return promises
$wakanda.$login(user, password);
$wakanda.$logout();
$wakanda.$currentUser();
$wakanda.$currentUserBelongsTo();
```

see [Wakanda Directory](http://doc.wakanda.org/home2.en.html#/Directory/Index-of-methods-and-properties.902-814586.en.html)


## DataStore API

The `DataStore` instance is created by the `init()` method and sent to its promise callback, or returned by the `getDataStore()` method. It holds a collection of proxy Wakanda `DataClass` objects (ex: 'Product').

## DataClass API

`angular-wakanda` DataClass object are proxies of the backend defined Wakanda Dataclasses. As such, they expose all their properties and methods, as well as their structure metadata themselves.

### Metadata

```javascript
var dataClass = $wakanda.getDatastore().Product
dataClass.$name; // 'Product'
dataClass.$collectionName; // 'ProductCollection'
dataClass.$attr(); // return an array of attributes metadata of the entity
dataClass.$attr('name'); // return the 'name' attribute metadata
dataClass.$entityMethods(); // return all metadatas on all user defined entity methods
dataClass.$entityMethods('myMethod'); // return all user defined entity methods names (array of string)
dataClass.$collectionMethods(); // return all user defined collection methods names (array of string)
dataClass.$dataClassMethods(); // return all user defined dataclass methods names (array of string)
```


**TODO**

Metadatas format of attributes is to be defined

### Wakanda User defined Methods

All DataClass level Wakanda User Defined methods are added to the dataClass instance.
They return a promise.


```javascript
var Product = ds.Product; // get the Product DataClass
Product.myMethod().then(function () {}); // call one of its methods
```


### Framework methods and properties


#### Syntax (inspired by ngResource)

They are prefixed by $ to avoid name collision with user defined methods

Like for ngResource, those methods return an empty array, or object, with a $promise property.


```javascript
//Direct binding
$scope.people = Person.$find();

$scope.people.length == 0; // Will be populated after async result
$scope.people.$promise; // a promise is provided if needed

// Wait for result before binding (need to transform result for example)
var people = ds.Person.$find({limit: 10}, function() {
	// people.length === 10;
	// modify people
	$scope.people = people;
});

// Can bind straight away but need to be notified after load done 
$scope.spinnerActive = true;
$scope.people = ds.Person.$find({limit: 10}, function() {
	$scope.spinnerActive = false;
});
// alternative syntax via the $promise property
$scope.people = ds.Person.$find({limit: 10});
$scope.people.$promise.then(function() {
	$scope.spinnerActive = false;
});
```

#### $find()


```javascript
var products = ds.Product.$find({
	select: '',
	filter: '',
	orderBy: '',
	start: 0,
	pageSize: 50
});
```


The returned value (products in the above example) is an EntityCollection.

See supra (ngResource syntax) for full syntax ($promise and callback)

#### $findOne()

Returns an object


```javascript
var product = ds.Product.$findOne(id);
```


See supra (ngResource syntax) for full syntax ($promise and callback)

#### $distinctValues()

Returns an entityCollection or just an array ? **(TO BE DEFINED)**


```javascript
var categories = ds.Product.$distinctValues('category');
```


#### $create()

Created entities:

* have angular-wakanda methods (<code>$save()</code>, <code>$remove()</code>)
* have Wakanda User Defined entity methods
* are not sync with the server until the developer call <code>$save()</code> (no automatique save)


```javascript
var newProduct = ds.Product.$create({
  name: 'a product name'
});
newProduct.aUserDefinedMethod();
newProduct.$save();
```


## EntityCollection API

Is an array.
Provide access to individual entities:


```javascript
var firstProduct = products[0];

$scope.myProduct = products[10];
```


### User defined methods

All Collection level Wakanda User defined methods are available on the entity collection. They return a promise.


```javascript
products.myCollectionMethod().then(function() {});
```


### Framework methods and properties

They are prefixed by $ to avoid name collision with user defined methods

#### $totalCount

An integer property indicating the total count of all entities in the entity collection.
This property correspond to the length property of the entity collection.
When doing a fetch, if the `$totalCount` has changed, the property value is updated.

#### $entitysetId

Contains the entityset id internally used to execute `$fetch()` calls

#### $fetching

A boolean at true if the entity collection is currently fetching data.
Is set to false after the http response (even if we get an error).
Is set to true when the entity collection is first created with `ds.Entity.$find()`

Can be used to show a spinner

#### $fetch()

Retrieve entities from the server in the same entityset


```javascript
products.$fetch({
	select: '',
	filter: '',
	orderBy: '',
	start: 0,
	pageSize: 50
});
```


`$fetch()` modify the array of the current entity collection (`products` here)


```javascript
products.$fetch({
	start: 0,
	pageSize: 50
}); // products will be modified
```


Without parameters, the `$fetch()` refresh the data with the `$query.start` and `$query.pageSize` current values


```javascript
products.$fetch(); 
```

`$fetch()` returns a promise.


```javascript
products.$fetch({
	start: 0,
	pageSize: 50
}).then(function() {});
```


So the developer *doesn't have to write* code like this :


```javascript
$scope.products.$fetch(start, pageSize).then(function(products) {
  $scope.products = products;
});
```



#### $find()

Retrieve entities from the server in the same entityset using the same api as $find on dataclass.


```javascript
var filteredProducts = products.$find({
	select: '',
	filter: '',
	orderBy: '',
	start: 0,
	pageSize: 50
});
```


Unlike `$fetch()`, `$find()` do not modify the array of the current entity collection (products here) but return a new entity collection. This functionality is usefull for related entities if you want to have multiple display of them.

#### $query()

Contains the state of the initial fetch parameters.

```javascript
products.$query.pageSize;
products.$query.start;
products.$query.filter;
```


This is usefull in order to code the sugars.

#### Additionnal sugar methods

TODO 

* $nextPage();
* $prevPage();
* $gotoPage();
* $more();


## Entity API

Entities are simple pojos :


```javascript
firstProduct.name; // attributes values;
firstProduct.fullName; // calculated attributes values;
```


### User defined methods

All Entity level Wakanda User defined methods are available on the entity. They return a promise.


```javascript
product.myEntityMethod().then(function() {}); // entity method
```



### Framework methods and properties

They are prefixed by $ to avoid name collision with user defined methods


#### $save()

Save an entity on the server. This method return a promise


```javascript
product.$save().then(function() {});
```


If the server version of the entity is different from the original changed entity, it must be updated and changes notifications are then triggered.


##### Link to another entity

The value of a relation attribute can be set by assigning a saved entity to it. 

Example :

```javascript
var productCategory = ds.Category.$create({name: 'fruit'});
productCategory.$save().then(function() {
	firstProduct.category = productCategory;
	firstProduct.$save();
});
```


If the related entity is new and not saved, the `$save()` method of the parent entity (firstProduct here) throws an error.

Only NgWakEntity object are  accepted, not pojos.
The modifications are checked when the `$save()` method of the parent entity is called (comparison between related entity in WAFEntity and NgWakEntity). 



#### $fetch()

Equivalent of the [Wakanda Framework `serverRefresh()` method](http://doc.wakanda.org/Datasource/Datasources/serverRefresh.301-607702.en.html) with `forceReload=true` on entities

Is mostly used for deferred loading

##### $fetch() on deferred objects

When a related attributes is not expanded in the initial query, the user must fetch it.


```javascript
var person = persons[0];
// person.company.name === undefined;
person.company.$fetch().then(function() {
  // person.company.name === '4D'
});
```


By default, the related entity collection (staff below) is an empty `NgWakCollection`. The `$fetch()` method is the standard entity collections one.


```javascript
var company = companies[0];
company.staff.length == 0;
company.staff.$fetch().then(function() {
  company.staff.length == 40;
});
```


If the developer has selected staff in the companies initial query, the `NgWakCollection` will not be empty even if it's not correlated with an entityset server side.

When the developer call `$fetch()` on companies, the entityset will be created.

**TODO **

user must be able to specify which attributes to select

think about a $dirty or $dirty() feature ($dirty is done with watch, optimised for high read/write, $dirty() is done with diff, optimised for high write/read)


#### $serverCompute()

Equivalent of the [Wakanda Framework `serverRefresh()` method](http://doc.wakanda.org/Datasource/Datasources/serverRefresh.301-607702.en.html) with `forceReload=false` on entities


```javascript
var firstProduct = products[0];
firstProduct.name = 'New name';
firstProduct.$serverCompute();
```


#### $remove()


```javascript
var firstProduct = products[0];
firstProduct.$remove();

firstProduct.$remove().then(function() {});
```


firstProduct should not be removed from the products array, the developer must do it manually.

## Image / Blob Attribute API


#### src

Images and blob urls are available their a `src` attribute.


```javascript
employee.largePhoto.src === '/rest/employee(123)/largePhoto/...'
```


#### $upload(file)

The image or blob attribute have a $upload() method to upload file.
This method expects a window.File parameter. It returns a promise.

Here some pseudo-code of this function:


```javascript
employee.largePhoto.$upload(img);
```


**Usage code**

For an input like this : 


```html
&lt;input type="file" id="fileToUpload" /&gt;
```



```javascript
var file = document.getElementById('fileToUpload').files[0];
employee.photo.$upload(file).then(…);
```




## API Architecture Advanced Overview 

`NgWakEntity` class have all framework methods on it's prototype :

* $save
* $serverRefresh
* $remove
* ...

`NgWakCollection` class have all framework methods on it's prototype :

* $fetch
* ...

`NgWakCollection` extends `Array`

Based on the catalog and dataclass metadatas, for each dataclass, `{EntityName}Entity` and `{EntityName}Collection` classes are generated.

* They have all user defined methods on their prototype
* They extends the `NgWakEntity` and `NgWakCollection` prototypes using a strict inheritance. `{EntityName}Entity` has a `__proto__` property pointing to `NgWakEntity.prototype`.
* They have a $dataClass property pointing to `ds[{EntityName}]` where `ds` is received by the Promise callback of either `$wakanda.getDatastore()` or `$wakanda.init()`.

### Public exposure of prototypes

To be abble to extend the `NgWafEntity` API (override framework methods for all entities or only for a specific one or add client side methods), all prototypes are exposed.

The generic one :

```javascript
ds.$Entity === NgWafEntity
ds.$Collection === NgWakCollection
```


And the dataclass derived ones :

```javascript
ds.Product.$Entity = {EntityName}Entity
ds.Product.$Collection = {EntityName}Collection
```


**All pojos returned by the API extend `{EntityName}Entity` or `{EntityName}Collection`**

A pojo have a pointer to it's prototype via the `$Entity` property :


```javascript
employeePojo.$Entity === ds.Employee.$Entity
employeeCollectionPojo.$Collection === ds.Employee.$Collection
```


This include nested pojos (company of a person for example). This impact for example `$find()`, `$fetch()`, `$findOne()` and `$create()` methods that scan recursively their pojos.

One can write :

```javascript
me = ds.Person.$findOne({filter: 'name = ' + myname});
me.company.$save();
me.company.companyUserDefinedMethod();
me.$save();
me.personUserDefinedMEthod();
```

