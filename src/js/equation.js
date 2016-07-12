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

        if (angular.isFunction(ctrl.onReady)) {
            var equationApi = {
                value: ctrl.value
            };
            ctrl.onReady({equationApi: equationApi});
        }
    })
    .directive('equation', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                options: '=equationOptions',
                onReady: '&'
            },
            controller: 'EquationCtrl',
            controllerAs: 'equation',
            template: $templateCache.get('equation.html')
        };
    });
