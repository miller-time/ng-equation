'use strict';

angular.module('ngEquation')
    .factory('operandOptions', function() {
        var operandOptionsApi = {
            class: 'string',
            typeLabel: 'string',
            editMetadata: 'function',
            getLabel: 'function'
        };

        function MissingOperandOptionException(property) {
            this.error = 'Operand options missing required property "' + property + '".';
        }

        function OperandOptionTypeException(property, expectedType, propertyType) {
            this.error = 'Operand options property "' + property + '" is incorrect type. ' +
                'Expected: "' + expectedType + '". ' +
                'Got: "' + propertyType + '".';
        }

        return {
            validate: function(obj) {
                angular.forEach(operandOptionsApi, function(propertyType, apiProperty) {
                    if (!obj[apiProperty]) {
                        throw new MissingOperandOptionException(apiProperty);
                    } else if (typeof(obj[apiProperty]) !== propertyType) {
                        throw new OperandOptionTypeException(apiProperty, propertyType, typeof(obj[apiProperty]));
                    }
                });
            }
        };
    })
    .controller('ExpressionOperandCtrl', function($q, operandOptions) {
        var ctrl = this;

        operandOptions.validate(ctrl.options);

        ctrl.removeFromGroup = function() {
            if (ctrl.group) {
                ctrl.group.removeOperand(ctrl.options);
            }
        };

        ctrl.editMetadata = function() {
            var valueInitialized = angular.isDefined(ctrl.options.value);
            var editResult = ctrl.options.editMetadata();
            $q.when(editResult).then(function(result) {
                if (angular.isDefined(result)) {
                    ctrl.options.value = result;
                } else if (!valueInitialized) {
                    ctrl.removeFromGroup();
                }
            }, function() {
                if (!valueInitialized) {
                    ctrl.removeFromGroup();
                }
            });
        };

        if (ctrl.group && angular.isUndefined(ctrl.options.value)) {
            ctrl.editMetadata();
        }
    })
    .directive('expressionOperand', function($templateCache, expressionOperandDragNDrop) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                group: '=?',
                options: '=operandOptions'
            },
            controller: 'ExpressionOperandCtrl',
            controllerAs: 'operand',
            link: function(scope, element) {
                expressionOperandDragNDrop.setup(scope, element);
            },
            template: $templateCache.get('expression-operand.html')
        };
    });
