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
<link rel="stylesheet" type="text/css" href="ng-equation/dist/ng-equation.css">

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

Set up the equation options of the directive in a controller.

```javascript
myController.myEquationOptions = {
    availableOperands: [
        {
            class: 'fruit',
            typeLabel: 'Fruit',
            editMetadata: function() {
                // called to configure the operand
                return launchEditModal();
            },
            getLabel: function(operand) {
                return operand.value ? capitalize(operand.value) : 'N/A';
            }
        }
    ]
};

// Add an on ready function to access the equation api
myController.myOnEquationReady = function(equationApi) {
    ctrl.equationApi = equationApi;
};
```

Add equation directive to your html template.  equation-class="basic" adds styling from less/ng-equation-basic.less

```html
<equation
    equation-options="myController.myEquationOptions"
    equation-class="basic"
    on-ready="myController.myOnEquationReady(equationApi)">
</equation>
```

### Development

##### First time setup

(this will install the project dependencies and build the distribution files from source)

```
npm install
bower install
grunt build
```

##### Watch for changes and rebuild

(builds the distribution files and runs tests as needed as source files change)

```
grunt
```

##### Run Tests

(this will run unit tests and code linter)

```
grunt test
```

##### Demo

 * Run `http-server` from the root of the project (which can be installed via npm)
 * Open [demo URL](http://localhost:8080/demo/) in browser

### Release


##### Demo Site - [GitHub Page](https://miller-time.github.io/ng-equation/)

(deploys the directory demo to the gh-pages branch)

```
grunt deployDemo
```
