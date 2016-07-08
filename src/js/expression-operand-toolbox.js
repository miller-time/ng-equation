'use strict';

angular.module('ngEquation')
    .controller('ExpressionOperandToolboxCtrl', function($timeout) {
        var ctrl = this;

        ctrl.getIndexOfOperand = function(operand) {
            for (var i = 0; i < ctrl.operands.length; ++i) {
                if (ctrl.operands[i].class === operand.class &&
                    ctrl.operands[i].label === operand.label) {
                    return i;
                }
            }
            return -1;
        };

        var originalOperandsList = angular.copy(ctrl.operands);

        ctrl.refresh = function(operandIndex) {
            if (angular.isDefined(operandIndex) && operandIndex !== -1) {
                var freshOperand = angular.copy(originalOperandsList[operandIndex]);
                ctrl.operands.splice(operandIndex, 1, freshOperand);
            } else {
                ctrl.operands = [];
                $timeout(function() {
                    ctrl.operands = angular.copy(originalOperandsList);
                });
            }
        };

        ctrl.refresh();

        ctrl.removeOperand = function(operand) {
            ctrl.refresh(ctrl.getIndexOfOperand(operand));
        };
    })
    .directive('expressionOperandToolbox', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                operands: '='
            },
            controller: 'ExpressionOperandToolboxCtrl',
            controllerAs: 'toolbox',
            template: $templateCache.get('expression-operand-toolbox.html')
        };
    });
