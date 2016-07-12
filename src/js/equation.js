'use strict';

angular.module('ngEquation')
    .controller('EquationCtrl', function() {
        var ctrl = this;

        ctrl.topLevelGroup = {
            operator: 'AND',
            operands: [],
            onReady: function(groupApi) {
                ctrl.groupApi = groupApi;
            }
        };

        ctrl.value = function() {
            var value;
            if (ctrl.groupApi) {
                value = ctrl.groupApi.value();
            }
            return value;
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
