'use strict';

angular.module('ngEquation')
    .controller('ExpressionGroupCtrl', function() {
        var ctrl = this;

        console.log(ctrl.operator, ctrl.operands);
    })
    .directive('expressionGroup', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                operator: '@',
                operands: '='
            },
            controller: 'ExpressionGroupCtrl',
            controllerAs: 'group',
            link: function(scope, element, attrs, controller) {
                interact(element.find('span')[0])
                    .dropzone({
                        accept: '.eq-operand',
                        ondropactivate: function(event) {
                            event.target.classList.add('drop-active');
                        },
                        ondragenter: function(event) {
                            event.target.classList.add('drop-target');

                            // operand
                            event.relatedTarget.classList.add('can-drop');

                            // change operand's snap target to be this group

                            var dropRect = interact.getElementRect(event.target),
                                dropCenter = {
                                    x: dropRect.left + dropRect.width / 2,
                                    y: dropRect.top + dropRect.height / 2
                                };

                            event.draggable.draggable({
                                snap: {
                                    targets: [dropCenter]
                                }
                            });
                        },
                        ondragleave: function(event) {
                            event.target.classList.remove('drop-target');

                            // operand
                            event.relatedTarget.classList.remove('can-drop');

                            // restore operand's snap target to its original position

                            event.draggable.draggable({
                                snap: {
                                    targets: [{
                                        x: parseFloat(event.relatedTarget.getAttribute('data-start-x')),
                                        y: parseFloat(event.relatedTarget.getAttribute('data-start-y'))
                                    }]
                                }
                            });
                        },
                        ondrop: function(event) {
                            event.relatedTarget.classList.remove('can-drop');

                            var operand = {};
                            var operandCtrl = angular.element(event.relatedTarget).scope().operand;
                            operand.operandClass = operandCtrl.operandClass;
                            operand.label = operandCtrl.label;
                            console.log('dropped', operand);

                            var group = {};
                            console.log('target', event.target);
                            var groupCtrl = angular.element(event.target).scope().group;
                            group.operator = groupCtrl.operator;
                            group.operands = groupCtrl.operands;
                            console.log('onto', group);
                        },
                        ondropdeactivate: function(event) {
                            event.target.classList.remove('drop-active');
                            event.target.classList.remove('drop-target');
                        }
                    });
            },
            template: $templateCache.get('expression-group.html')
        };
    });
