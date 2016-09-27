'use strict';

angular.module('ngEquation')
    .factory('operandOptions', function(MissingOperandOptionException, OperandOptionTypeException) {
        var operandOptionsApi = {
            class: {
                type: 'string',
                required: true
            },
            typeLabel: {
                type: 'string',
                required: true
            },
            editMetadata: {
                type: 'function',
                required: true
            },
            getLabel: {
                type: 'function',
                required: true
            },
            getTooltipText: {
                type: 'function',
                required: false
            }
        };

        return {
            validate: function(obj) {
                angular.forEach(operandOptionsApi, function(propertyOptions, propertyName) {
                    if (propertyOptions.required && !(propertyName in obj)) {
                        throw new MissingOperandOptionException(propertyName);
                    } else if (propertyName in obj && typeof (obj[propertyName]) !== propertyOptions.type) {
                        throw new OperandOptionTypeException(propertyName, propertyOptions.type, typeof (obj[propertyName]));
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

        function addAdditionalOperands(values) {
            if (ctrl.group) {
                angular.forEach(values, function(value) {
                    var newOperand = angular.copy(ctrl.options);
                    newOperand.value = value;
                    ctrl.group.addOperand(newOperand);
                });
            } else {
                $log.error('unable to add additional operands because there is no group');
            }
        }

        ctrl.editMetadata = function() {
            var editResult = ctrl.options.editMetadata(ctrl.options);
            $q.when(editResult).then(function(result) {
                var value = result && result.value,
                    addMultiple = result && result.addMultiple;

                if (angular.isDefined(value)) {
                    if (angular.isArray(value) && addMultiple) {
                        ctrl.options.value = value[0];
                        addAdditionalOperands(value.slice(1));
                    } else if (!angular.isArray(value) && addMultiple) {
                        $log.error('editMetadata must return an array when using the "addMultiple" option');
                    } else {
                        ctrl.options.value = value;
                    }

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
            ctrl.editMetadata(ctrl.options);
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
