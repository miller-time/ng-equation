ng-equation
===========

Boolean Equation Builder for complex data

[Demo](https://miller-time.github.io/ng-equation/)


### Installation

Install via bower or download source from this repo

```
bower install ng-equation
```

Add the following to your html (angular and interact are required dependencies)

```html
<link rel="stylesheet" href="bootstrap/dist/css/bootstrap.min.css">

<script src="jquery/dist/jquery.min.js"></script>
<script src="angular/angular.min.js"></script>
<script src="angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
<script src="interact/interact.js"></script>
<script src="ng-equation/dist/ng-equation-template.js"></script>
<script src="ng-equation/dist/ng-equation.min.js"></script>
```

Inject `ngEquation` into your application

```javascript
angular.module('myApp', ['ngEquation']);
```

### Development

##### First time setup

(this will install the project dependencies and build the distribution files from source)

```
npm install
bower install
grunt
```

##### Rebuild

(do this after making changes)

```
grunt build
```

##### Run Tests

(this will run unit tests and code linter)

```
grunt test
```

##### Demo
Open demo/index.html in browser

### Release


##### Demo Site - [GitHub Page](https://miller-time.github.io/ng-equation/)

(deploys the directory demo to the gh-pages branch)

```
grunt deployDemo
```