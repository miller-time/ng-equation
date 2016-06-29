'use strict';

angular.module('ngEquation')
    .controller('ExpressionOperandToolboxCtrl', function($timeout) {
        var ctrl = this;

        // extend the operands in the toolbox by supplying them with a method
        // that removes them from the toolbox, followed by a toolbox refresh

        function OperandOptions(config) {
            this.class = config.class;
            this.label = config.label;
        }

        OperandOptions.prototype.removeOperand = function() {
            var operandIndex = ctrl.getIndexOfOperand(this);
            if (operandIndex !== -1) {
                ctrl.operands.splice(operandIndex, 1);
            }
            ctrl.refresh();
        };

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

        ctrl.refresh = function() {
            ctrl.operands = [];
            $timeout(function() {
                ctrl.operands = originalOperandsList.map(function(operand) {
                    return new OperandOptions(operand);
                });
            });
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
