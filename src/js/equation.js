'use strict';

angular.module('ngEquation')
    .controller('EquationCtrl', function() {
        var ctrl = this;

        ctrl.topLevelGroup = {
            operator: 'AND',
            operands: []
        };
    })
    .directive('equation', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                options: '=equationOptions'
            },
            controller: 'EquationCtrl',
            controllerAs: 'equation',
            template: $templateCache.get('equation.html')
        };
    });
