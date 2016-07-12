'use strict';

angular.module('exampleApp', ['ngEquation'])
    .controller('ExampleCtrl', function(fruitOperand) {
        var ctrl = this;

        ctrl.config = {
            availableOperands: [fruitOperand.config()]
        };
    });
