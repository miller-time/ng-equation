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

        ctrl.formula = function() {
            var formula;
            if (ctrl.groupApi) {
                formula = ctrl.groupApi.formula();
            }
            return formula;
        };

        if (angular.isFunction(ctrl.onReady)) {
            var equationApi = {
                value: ctrl.value,
                formula: ctrl.formula
            };
            ctrl.onReady({equationApi: equationApi});
        }
    })
    .directive('equation', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            transclude: {
                toolboxLabel: '?toolboxLabel'
            },
            bindToController: {
                options: '=equationOptions',
                class: '@equationClass',
                onReady: '&'
            },
            controller: 'EquationCtrl',
            controllerAs: 'equation',
            template: $templateCache.get('equation.html')
        };
    });
