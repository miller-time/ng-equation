'use strict';

angular.module('ngEquation')
    .controller('ExpressionGroupCtrl', function($filter) {
        var ctrl = this;

        // extend this group's operands by supplying them with a method
        // that removes them from the group when called

        function OperandOptions(config) {
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
            var operand = this,
                operandIndex = -1;

            for (var i = 0; i < ctrl.operands.length; ++i) {
                if (ctrl.operands[i].class === this.class &&
                    ctrl.operands[i].label === this.label) {
                    operandIndex = i;
                }
            }
            if (operandIndex !== -1) {
                ctrl.operands.splice(operandIndex, 1);
            }
        };

        ctrl.operands = ctrl.operands.map(function(operand) {
            return new OperandOptions(operand);
        });
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

                            var operandCtrl = angular.element(event.relatedTarget).scope().operand;
                            console.log('dropped', operandCtrl.options);

                            var group = {};
                            console.log('target', event.target);
                            var groupCtrl = angular.element(event.target).scope().group;
                            group.operator = groupCtrl.operator;
                            group.operands = groupCtrl.operands;
                            console.log('onto', group);

                            console.log('removing operand from old group...');
                            scope.$apply(function() {
                                operandCtrl.options.removeOperand(operandCtrl.options);
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
