'use strict';

angular.module('ngEquation')
    .controller('ExpressionOperandToolboxCtrl', function() {})
    .directive('expressionOperandToolbox', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                operands: '=',
                defaultGroupApi: '<?',
                equationOptions: '<'
            },
            controller: 'ExpressionOperandToolboxCtrl',
            controllerAs: 'toolbox',
            template: $templateCache.get('expression-operand-toolbox.html')
        };
    });
