'use strict';

angular.module('ngEquation')
    .controller('ExpressionOperandCtrl', function() {
        var ctrl = this;

        console.log(ctrl.label);
    })
    .directive('expressionOperand', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                operandClass: '@',
                label: '@'
            },
            controller: 'ExpressionOperandCtrl',
            controllerAs: 'operand',
            link: function(scope, element) {
                interact(element.find('span').eq(0).find('span')[0])
                    .draggable({
                        restrict: {
                            restriction: 'parent',
                            endOnly: true,
                            elementRect: {left: 0, right: 1, top: 0, bottom: 1}
                        },
                        autoScroll: true,
                        onmove: function(event) {
                            var target = event.target,
                                x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                                y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                            // translate the operand relative to where mouse was dragged
                            target.style.webkitTransform =
                                target.style.transform =
                                    'translate(' + x + 'px, ' + y + 'px)';

                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);
                        }
                    });
            },
            template: $templateCache.get('expression-operand.html')
        };
    });
