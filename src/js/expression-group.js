'use strict';

angular.module('ngEquation')
    .controller('ExpressionGroupCtrl', function() {
        var ctrl = this;

        // extend this group's operands by supplying them with a method
        // that removes them from the group when called
        /* eslint-disable angular/controller-as-vm */
        function OperandOptions(config) {
            this.group = ctrl;
            this.class = config.class;
            this.label = config.label;
            if (angular.isDefined(config.operator)) {
                this.operator = config.operator;
            }
            if (angular.isDefined(config.operands)) {
                this.operands = config.operands;
            }
        }

        OperandOptions.prototype.removeOperand = function() {
            var operandIndex = ctrl.getIndexOfOperand(this);
            if (operandIndex !== -1) {
                ctrl.operands.splice(operandIndex, 1);
            }
        };
        /* eslint-enable angular/controller-as-vm */

        ctrl.operands = ctrl.operands.map(function(operand) {
            return new OperandOptions(operand);
        });

        ctrl.addOperand = function(operand) {
            ctrl.operands.push(new OperandOptions(operand));
        };

        ctrl.addSubgroup = function() {
            ctrl.addOperand({
                operator: 'AND',
                operands: []
            });
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

        ctrl.removeSubgroup = function(subgroupId) {
            ctrl.operands.splice(subgroupId, 1);
        };
    })
    .directive('expressionGroup', function($templateCache) {
        return {
            restrict: 'EA',
            scope: {},
            bindToController: {
                parent: '=?',
                subgroupId: '@',
                operator: '@',
                operands: '=',
                availableOperands: '='
            },
            controller: 'ExpressionGroupCtrl',
            controllerAs: 'group',
            link: function(scope, element) {
                interact(element.find('.eq-new-operand')[0])
                    .dropzone({
                        accept: '.eq-operand',
                        checker: function(dragEvent, event, dropped, dropZone, dropElement, draggable, draggableElement) {
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

                            var operandCtrl = angular.element(event.relatedTarget).scope().operand,
                                groupCtrl = angular.element(event.target).scope().group;

                            scope.$apply(function() {
                                groupCtrl.addOperand(operandCtrl.options);
                            });

                            scope.$apply(function() {
                                operandCtrl.removeFromGroup();
                            });
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
