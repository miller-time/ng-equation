'use strict';

angular.module('ngEquation')
    .controller('ExpressionOperandToolboxCtrl', function($timeout) {
        var ctrl = this;

        // extend the operands in the toolbox by supplying them with a method
        // that removes them from the toolbox, followed by a toolbox refresh
        /* eslint-disable angular/controller-as-vm */
        function OperandOptions(config) {
            this.class = config.class;
            this.label = config.label;
        }

        OperandOptions.prototype.removeOperand = function() {
            ctrl.refresh(ctrl.getIndexOfOperand(this));
        };
        /* eslint-enable angular/controller-as-vm */

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
                var freshOperand = new OperandOptions(originalOperandsList[operandIndex]);
                ctrl.operands.splice(operandIndex, 1, freshOperand);
            } else {
                ctrl.operands = [];
                $timeout(function() {
                    ctrl.operands = originalOperandsList.map(function(operand) {
                        return new OperandOptions(operand);
                    });
                });
            }
        };

        ctrl.refresh();
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
