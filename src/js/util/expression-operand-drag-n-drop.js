'use strict';

angular.module('ngEquation')
    .factory('expressionOperandDragNDrop', function($window) {
        return {
            setup: function(scope, element) {
                var operandElement = element.find('.eq-operand')[0];

                $window.interact(operandElement)
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
                                var rect = $window.interact.getElementRect(event.target);

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
                    })
                    .dropzone({
                        accept: '.eq-operand',
                        checker: function(
                            _dragEvent,
                            _event,
                            dropped,
                            _dropZone,
                            dropElement,
                            _draggable,
                            draggableElement
                        ) {
                            var existingOperandScope = angular.element(dropElement).scope();
                            if (existingOperandScope) {
                                var existingOperandCtrl = existingOperandScope.operand;
                                if (dropped && existingOperandCtrl) {
                                    var newOperandCtrl = angular.element(draggableElement).scope().operand;

                                    return dropped &&
                                        (existingOperandCtrl.options.value !== newOperandCtrl.options.value);
                                }
                            }
                            return false;
                        },
                        ondropactivate: function(event) {
                            event.target.classList.add('drop-active');
                        },
                        ondragenter: function(event) {
                            event.target.classList.add('drop-target');

                            // existing operand
                            event.relatedTarget.classList.add('can-drop');

                            // change new operand's snap target to be the existing operand
                            // otherwise when the new operand is dropped the drop event will be
                            // triggered with the original location of the new operand
                            // (the snap happens before the drop is triggered)

                            var dropRect = $window.interact.getElementRect(event.target),
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

                            // existing operand
                            event.relatedTarget.classList.remove('can-drop');

                            // restore new operand's snap target to its original position

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

                            var newOperandCtrl = angular.element(event.relatedTarget).scope().operand,
                                existingOperandCtrl = angular.element(event.target).scope().operand;

                            scope.$apply(function() {
                                existingOperandCtrl.group.addOperand({
                                    operator: 'AND',
                                    operands: [existingOperandCtrl.options, newOperandCtrl.options]
                                });
                            });

                            scope.$apply(function() {
                                existingOperandCtrl.removeFromGroup();
                            });

                            if (newOperandCtrl.group) {
                                // remove from old group

                                scope.$apply(function() {
                                    newOperandCtrl.removeFromGroup();
                                });
                            } else {
                                // restore new operand's snap target to its original position

                                var newOperandElement = event.relatedTarget;

                                event.draggable.draggable({
                                    snap: {
                                        targets: [{
                                            x: parseFloat(newOperandElement.getAttribute('data-start-x')),
                                            y: parseFloat(newOperandElement.getAttribute('data-start-y'))
                                        }]
                                    }
                                });

                                // move new operand to its original position

                                newOperandElement.style.webkitTransform =
                                    newOperandElement.style.transform =
                                        'none';

                                newOperandElement.setAttribute('data-x', 0);
                                newOperandElement.setAttribute('data-y', 0);
                            }
                        },
                        ondropdeactivate: function(event) {
                            event.target.classList.remove('drop-active');
                            event.target.classList.remove('drop-target');
                        }
                    })
                    .allowFrom('.eq-operand-drag-btn')
                    .actionChecker(function(_pointer, event, action) {
                        if (event.button !== 0) {
                            return null;
                        }
                        return action;
                    });
            }
        };
    });
