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
    .controller('ExpressionOperandCtrl', function($q, $log, operandOptions) {
        var ctrl = this;

        operandOptions.validate(ctrl.options);

        var isValueInitialized = angular.isDefined(ctrl.options.value);

        ctrl.removeFromGroup = function() {
            if (ctrl.group) {
                ctrl.group.removeOperand(ctrl.options);
            }
        };

        ctrl.editMetadata = function() {
            var editResult = ctrl.options.editMetadata();
            $q.when(editResult).then(function(result) {
                if (angular.isDefined(result)) {
                    ctrl.options.value = result;
                    isValueInitialized = true;
                } else if (!isValueInitialized) {
                    ctrl.removeFromGroup();
                } else {
                    $log.warn('editMetadata resulted in undefined value, operand will retain previous value of ' + ctrl.options.value);
                }
            }, function() {
                if (!isValueInitialized) {
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
