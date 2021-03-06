'use strict';

angular.module('ngEquation')
    .controller('ExpressionGroupCtrl', function() {
        var ctrl = this;

        ctrl.addOperand = function(operand) {
            ctrl.operands.push(angular.copy(operand));
        };

        ctrl.addSubgroup = function() {
            ctrl.addOperand({
                operator: 'AND',
                operands: []
            });
        };

        ctrl.isSubgroup = function(operand) {
            return !!operand.operands;
        };

        ctrl.getIndexOfOperand = function(operand) {
            if (!ctrl.isSubgroup(operand)) {
                for (var i = 0, len = ctrl.operands.length; i < len; i++) {
                    if (!ctrl.isSubgroup(ctrl.operands[i]) && ctrl.operands[i].value === operand.value) {
                        return i;
                    }
                }
            }
            return -1;
        };

        ctrl.removeSubgroup = function(subgroupId) {
            ctrl.operands.splice(subgroupId, 1);
        };

        ctrl.removeOperand = function(operand) {
            var operandIndex = ctrl.getIndexOfOperand(operand);
            if (operandIndex !== -1) {
                ctrl.operands.splice(operandIndex, 1);
            }
        };

        function getValue(operand) {
            var value;
            if (ctrl.isSubgroup(operand)) {
                value = {
                    operator: operand.operator,
                    operands: operand.operands.map(function(childOperand) {
                        return getValue(childOperand);
                    })
                };
            } else {
                value = {
                    class: operand.class,
                    value: operand.value,
                    label: operand.getLabel(operand)
                };
            }
            return value;
        }

        ctrl.value = function() {
            return {
                operator: ctrl.operator,
                operands: ctrl.operands.map(function(operand) {
                    return getValue(operand);
                })
            };
        };

        function getFormula(operands, operator) {
            var operandFormulas = [];
            angular.forEach(operands, function(operand) {
                if (ctrl.isSubgroup(operand)) {
                    operandFormulas.push(['(', getFormula(operand.operands, operand.operator), ')'].join(''));
                } else {
                    operandFormulas.push(operand.getLabel(operand));
                }
            });
            var prefix = '';
            if (operator === 'AND NOT') {
                prefix = 'NOT ';
            }
            return prefix + operandFormulas.join(' ' + operator + ' ');
        }

        ctrl.formula = function() {
            return getFormula(ctrl.operands, ctrl.operator);
        };

        if (angular.isFunction(ctrl.onReady)) {
            var groupApi = {
                value: ctrl.value,
                formula: ctrl.formula,
                addOperand: ctrl.addOperand
            };
            ctrl.onReady({groupApi: groupApi});
        }
    })
    .directive('expressionGroup', function($compile, $templateCache, expressionGroupDragNDrop) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                parent: '=?',
                subgroupId: '@',
                operator: '=',
                operands: '=',
                availableOperands: '=',
                onReady: '&',
                equationOptions: '<'
            },
            controller: 'ExpressionGroupCtrl',
            controllerAs: 'group',
            compile: function(cElement) {
                // break recursion loop by removing contents
                var contents = cElement.contents().remove();
                var compiledContents;
                return {
                    post: function(scope, element) {
                        // compile contents
                        if (!compiledContents) {
                            compiledContents = $compile(contents);
                        }
                        // re-add contents to element
                        compiledContents(scope, function(clone) {
                            element.append(clone);
                        });

                        expressionGroupDragNDrop.setup(scope, element);
                    }
                };
            },
            template: $templateCache.get('expression-group.html')
        };
    });
