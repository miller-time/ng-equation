'use strict';

angular.module('ngEquation')
    .factory('expressionGroupDragNDrop', function($window) {
        return {
            setup: function(scope, element) {
                $window.interact(element.find('.eq-new-operand')[0])
                    .dropzone({
                        accept: '.eq-operand',
                        overlap: 0.10,
                        checker: function(
                            _dragEvent,
                            _event,
                            dropped,
                            _dropZone,
                            dropElement,
                            _draggable,
                            draggableElement
                        ) {
                            var operandCtrl = angular.element(draggableElement).scope().operand;

                            var groupScope = angular.element(dropElement).scope();
                            if (groupScope) {
                                var groupCtrl = angular.element(dropElement).scope().group;

                                return dropped && (groupCtrl.getIndexOfOperand(operandCtrl.options) === -1);
                            }
                            return false;
                        },
                        ondropactivate: function(event) {
                            event.target.classList.add('drop-active');
                        },
                        ondragenter: function(event) {
                            event.target.classList.add('drop-target');

                            // operand
                            event.relatedTarget.classList.add('can-drop');

                            // change operand's snap target to be this group
                            // otherwise when the operand is dropped the drop event will be
                            // triggered with the original location of the operand
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

                            var operandCtrl = angular.element(event.relatedTarget).scope().operand,
                                groupCtrl = angular.element(event.target).scope().group;

                            scope.$apply(function() {
                                groupCtrl.addOperand(operandCtrl.options);
                            });

                            if (operandCtrl.group) {
                                // remove from old group

                                scope.$apply(function() {
                                    operandCtrl.removeFromGroup();
                                });
                            } else {
                                // restore operand's snap target to its original position

                                var operandElement = event.relatedTarget;

                                event.draggable.draggable({
                                    snap: {
                                        targets: [{
                                            x: parseFloat(operandElement.getAttribute('data-start-x')),
                                            y: parseFloat(operandElement.getAttribute('data-start-y'))
                                        }]
                                    }
                                });

                                // move operand to its original position

                                operandElement.style.webkitTransform =
                                    operandElement.style.transform =
                                        'none';

                                operandElement.setAttribute('data-x', 0);
                                operandElement.setAttribute('data-y', 0);
                            }
                        },
                        ondropdeactivate: function(event) {
                            event.target.classList.remove('drop-active');
                            event.target.classList.remove('drop-target');
                        }
                    });
            }
        };
    });
