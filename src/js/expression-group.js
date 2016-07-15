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
            for (var i = 0, len = ctrl.operands.length; i < len; i++) {
                if (ctrl.operands[i].value === operand.value) {
                    return i;
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
                    children: operand.operands.map(function(childOperand) {
                        return getValue(childOperand);
                    })
                };
            } else {
                value = {
                    itemType: operand.class,
                    id: operand.value,
                    label: operand.getLabel(operand)
                };
            }
            return value;
        }

        ctrl.value = function() {
            return {
                operator: ctrl.operator,
                children: ctrl.operands.map(function(operand) {
                    return getValue(operand);
                })
            };
        };

        if (angular.isFunction(ctrl.onReady)) {
            var groupApi = {
                value: ctrl.value
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
                onReady: '&'
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
