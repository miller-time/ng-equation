'use strict';

angular.module('ngEquation')
    .controller('ExpressionGroupCtrl', function() {
        var ctrl = this;

        console.log(ctrl.operator, ctrl.operands);
    })
    .directive('expressionGroup', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                operator: '@',
                operands: '='
            },
            controller: 'ExpressionGroupCtrl',
            controllerAs: 'group',
            template: $templateCache.get('expression-group.html')
        };
    });
