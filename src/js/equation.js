'use strict';

angular.module('ngEquation')
    .controller('EquationCtrl', function($filter, UnknownOperandClassException) {
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

        function loadOperand(operand) {
            if (operand.operands) {
                angular.forEach(operand.operands, function(childOperand) {
                    loadOperand(childOperand);
                });
            } else {
                var matchingOperandConfig = $filter('filter')(ctrl.options.availableOperands, {class: operand.class})[0];
                if (angular.isUndefined(matchingOperandConfig)) {
                    throw new UnknownOperandClassException(operand.class);
                }
                angular.extend(operand, matchingOperandConfig);
            }
        }

        ctrl.loadEquation = function(equation) {
            ctrl.topLevelGroup.operator = equation.operator;
            var operands = angular.copy(equation.operands);
            angular.forEach(operands, function(operand) {
                loadOperand(operand);
            });
            ctrl.topLevelGroup.operator = equation.operator;
            ctrl.topLevelGroup.operands = operands;
        };

        if (angular.isFunction(ctrl.onReady)) {
            var equationApi = {
                value: ctrl.value,
                formula: ctrl.formula,
                loadEquation: ctrl.loadEquation
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
