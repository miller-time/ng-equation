'use strict';

angular.module('ngEquation')
    .controller('ExpressionOperandCtrl', function() {
        var ctrl = this;

        console.log(ctrl.options.label);
    })
    .directive('expressionOperand', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                options: '=operandOptions'
            },
            controller: 'ExpressionOperandCtrl',
            controllerAs: 'operand',
            link: function(scope, element) {

                var operandElement = element.find('span').eq(0).find('span')[0];

                interact(operandElement)
                    .draggable({
                        autoScroll: true,
                        snap: {
                            range: Infinity,
                            relativePoints: [{x: 0.5, y: 0.5}],
                            endOnly: true
                        },
                        onstart: function(event) {

                            // record the original position of operand at beginning of first drag

                            var startX = parseFloat(event.target.getAttribute('data-start-x')),
                                startY = parseFloat(event.target.getAttribute('data-start-y'));

                            if (isNaN(startX) || isNaN(startY)) {
                                var rect = interact.getElementRect(event.target);

                                startX = rect.left + rect.width / 2;
                                startY = rect.top + rect.height / 2;

                                event.target.setAttribute('data-start-x', startX);
                                event.target.setAttribute('data-start-y', startY);

                                // snap operand to its original position

                                event.interactable.draggable({
                                    snap: {
                                        targets: [{x: startX, y: startY}]
                                    }
                                });
                            }
                        },
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
