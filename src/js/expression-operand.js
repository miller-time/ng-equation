'use strict';

angular.module('ngEquation')
    .controller('ExpressionOperandCtrl', function() {
        var ctrl = this;

        console.log(ctrl.label);
    })
    .directive('expressionOperand', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                containerClass: '@',
                label: '@'
            },
            controller: 'ExpressionOperandCtrl',
            controllerAs: 'operand',
            template: $templateCache.get('expression-operand.html')
        };
    });
