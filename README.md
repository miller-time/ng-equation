ng-equation
===========

Boolean Equation Builder for complex data


### Installation

Install via bower or download source from this repo

```
bower install ng-equation
```

Add the following to your html

```html
<script src="ng-equation/dist/ng-equation-template.js"></script>
<script src="ng-equation/dist/ng-equation.min.js"></script>
```

Inject `ngEquation` into your application

```javascript
angular.module('myApp', ['ngEquation']);
```

### Development

First time setup

(this will install the project dependencies and build the distribution files from source)

```
npm install
bower install
grunt
```

Rebuild

(do this after making changes)

```
grunt build
```
