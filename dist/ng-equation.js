"use strict";

angular.module("ngEquation", [ "ui.bootstrap", "ngEquation.templates" ]), angular.module("ngEquation").controller("EquationCtrl", function() {
    var ctrl = this;
    ctrl.topLevelGroup = {
        operator: "AND",
        operands: []
    };
}).directive("equation", [ "$templateCache", function($templateCache) {
    return {
        restrict: "EA",
        scope: {},
        bindToController: {
            options: "=equationOptions"
        },
        controller: "EquationCtrl",
        controllerAs: "equation",
        template: $templateCache.get("equation.html")
    };
} ]), angular.module("ngEquation").controller("ExpressionGroupCtrl", function() {
    var ctrl = this;
    ctrl.addOperand = function(operand) {
        ctrl.operands.push(operand);
    }, ctrl.addSubgroup = function() {
        ctrl.addOperand({
            operator: "AND",
            operands: []
        });
    }, ctrl.getIndexOfOperand = function(operand) {
        for (var i = 0; i < ctrl.operands.length; ++i) if (ctrl.operands[i]["class"] === operand["class"] && ctrl.operands[i].label === operand.label) return i;
        return -1;
    }, ctrl.removeSubgroup = function(subgroupId) {
        ctrl.operands.splice(subgroupId, 1);
    }, ctrl.removeOperand = function(operand) {
        var operandIndex = ctrl.getIndexOfOperand(operand);
        operandIndex !== -1 && ctrl.operands.splice(operandIndex, 1);
    };
}).directive("expressionGroup", [ "$templateCache", function($templateCache) {
    return {
        restrict: "EA",
        scope: {},
        bindToController: {
            parent: "=?",
            subgroupId: "@",
            operator: "@",
            operands: "=",
            availableOperands: "="
        },
        controller: "ExpressionGroupCtrl",
        controllerAs: "group",
        link: function(scope, element) {
            interact(element.find(".eq-new-operand")[0]).dropzone({
                accept: ".eq-operand",
                checker: function(dragEvent, event, dropped, dropZone, dropElement, draggable, draggableElement) {
                    var operandCtrl = angular.element(draggableElement).scope().operand, groupScope = angular.element(dropElement).scope();
                    if (groupScope) {
                        var groupCtrl = angular.element(dropElement).scope().group;
                        return dropped && groupCtrl.getIndexOfOperand(operandCtrl.options) === -1;
                    }
                    return !1;
                },
                ondropactivate: function(event) {
                    event.target.classList.add("drop-active");
                },
                ondragenter: function(event) {
                    event.target.classList.add("drop-target"), event.relatedTarget.classList.add("can-drop");
                    var dropRect = interact.getElementRect(event.target), dropCenter = {
                        x: dropRect.left + dropRect.width / 2,
                        y: dropRect.top + dropRect.height / 2
                    };
                    event.draggable.draggable({
                        snap: {
                            targets: [ dropCenter ]
                        }
                    });
                },
                ondragleave: function(event) {
                    event.target.classList.remove("drop-target"), event.relatedTarget.classList.remove("can-drop"), 
                    event.draggable.draggable({
                        snap: {
                            targets: [ {
                                x: parseFloat(event.relatedTarget.getAttribute("data-start-x")),
                                y: parseFloat(event.relatedTarget.getAttribute("data-start-y"))
                            } ]
                        }
                    });
                },
                ondrop: function(event) {
                    event.relatedTarget.classList.remove("can-drop");
                    var operandCtrl = angular.element(event.relatedTarget).scope().operand, groupCtrl = angular.element(event.target).scope().group;
                    if (scope.$apply(function() {
                        groupCtrl.addOperand(operandCtrl.options);
                    }), operandCtrl.group) scope.$apply(function() {
                        operandCtrl.removeFromGroup();
                    }); else {
                        var operandElement = event.relatedTarget;
                        event.draggable.draggable({
                            snap: {
                                targets: [ {
                                    x: parseFloat(operandElement.getAttribute("data-start-x")),
                                    y: parseFloat(operandElement.getAttribute("data-start-y"))
                                } ]
                            }
                        }), operandElement.style.webkitTransform = operandElement.style.transform = "none", 
                        operandElement.setAttribute("data-x", 0), operandElement.setAttribute("data-y", 0);
                    }
                },
                ondropdeactivate: function(event) {
                    event.target.classList.remove("drop-active"), event.target.classList.remove("drop-target");
                }
            });
        },
        template: $templateCache.get("expression-group.html")
    };
} ]), angular.module("ngEquation").controller("ExpressionOperandToolboxCtrl", function() {}).directive("expressionOperandToolbox", [ "$templateCache", function($templateCache) {
    return {
        restrict: "EA",
        scope: {},
        bindToController: {
            operands: "="
        },
        controller: "ExpressionOperandToolboxCtrl",
        controllerAs: "toolbox",
        template: $templateCache.get("expression-operand-toolbox.html")
    };
} ]), angular.module("ngEquation").controller("ExpressionOperandCtrl", function() {
    var ctrl = this;
    ctrl.removeFromGroup = function() {
        ctrl.group && ctrl.group.removeOperand(ctrl.options);
    };
}).directive("expressionOperand", [ "$templateCache", function($templateCache) {
    return {
        restrict: "EA",
        scope: {},
        bindToController: {
            group: "=?",
            options: "=operandOptions"
        },
        controller: "ExpressionOperandCtrl",
        controllerAs: "operand",
        link: function(scope, element) {
            var operandElement = element.find(".eq-operand")[0];
            interact(operandElement).draggable({
                autoScroll: !0,
                snap: {
                    range: 1 / 0,
                    relativePoints: [ {
                        x: .5,
                        y: .5
                    } ],
                    endOnly: !0
                },
                onstart: function(event) {
                    var startX = parseFloat(event.target.getAttribute("data-start-x")), startY = parseFloat(event.target.getAttribute("data-start-y"));
                    if (isNaN(startX) || isNaN(startY)) {
                        var rect = interact.getElementRect(event.target);
                        startX = rect.left + rect.width / 2, startY = rect.top + rect.height / 2, event.target.setAttribute("data-start-x", startX), 
                        event.target.setAttribute("data-start-y", startY), event.interactable.draggable({
                            snap: {
                                targets: [ {
                                    x: startX,
                                    y: startY
                                } ]
                            }
                        });
                    }
                },
                onmove: function(event) {
                    var target = event.target, x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx, y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
                    target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)", 
                    target.setAttribute("data-x", x), target.setAttribute("data-y", y);
                }
            }).dropzone({
                accept: ".eq-operand",
                checker: function(dragEvent, event, dropped, dropZone, dropElement, draggable, draggableElement) {
                    var existingOperandScope = angular.element(dropElement).scope();
                    if (existingOperandScope) {
                        var existingOperandCtrl = existingOperandScope.operand;
                        if (dropped && existingOperandCtrl) {
                            var newOperandCtrl = angular.element(draggableElement).scope().operand;
                            return dropped && (existingOperandCtrl.options["class"] !== newOperandCtrl.options["class"] || existingOperandCtrl.options.label !== newOperandCtrl.options.label);
                        }
                    }
                    return !1;
                },
                ondropactivate: function(event) {
                    event.target.classList.add("drop-active");
                },
                ondragenter: function(event) {
                    event.target.classList.add("drop-target"), event.relatedTarget.classList.add("can-drop");
                    var dropRect = interact.getElementRect(event.target), dropCenter = {
                        x: dropRect.left + dropRect.width / 2,
                        y: dropRect.top + dropRect.height / 2
                    };
                    event.draggable.draggable({
                        snap: {
                            targets: [ dropCenter ]
                        }
                    });
                },
                ondragleave: function(event) {
                    event.target.classList.remove("drop-target"), event.relatedTarget.classList.remove("can-drop"), 
                    event.draggable.draggable({
                        snap: {
                            targets: [ {
                                x: parseFloat(event.relatedTarget.getAttribute("data-start-x")),
                                y: parseFloat(event.relatedTarget.getAttribute("data-start-y"))
                            } ]
                        }
                    });
                },
                ondrop: function(event) {
                    event.relatedTarget.classList.remove("can-drop");
                    var newOperandCtrl = angular.element(event.relatedTarget).scope().operand, existingOperandCtrl = angular.element(event.target).scope().operand;
                    if (scope.$apply(function() {
                        existingOperandCtrl.group.addOperand({
                            operator: "AND",
                            operands: [ existingOperandCtrl.options, newOperandCtrl.options ]
                        });
                    }), scope.$apply(function() {
                        existingOperandCtrl.removeFromGroup();
                    }), newOperandCtrl.group) scope.$apply(function() {
                        newOperandCtrl.removeFromGroup();
                    }); else {
                        var newOperandElement = event.relatedTarget;
                        event.draggable.draggable({
                            snap: {
                                targets: [ {
                                    x: parseFloat(newOperandElement.getAttribute("data-start-x")),
                                    y: parseFloat(newOperandElement.getAttribute("data-start-y"))
                                } ]
                            }
                        }), newOperandElement.style.webkitTransform = newOperandElement.style.transform = "none", 
                        newOperandElement.setAttribute("data-x", 0), newOperandElement.setAttribute("data-y", 0);
                    }
                },
                ondropdeactivate: function(event) {
                    event.target.classList.remove("drop-active"), event.target.classList.remove("drop-target");
                }
            });
        },
        template: $templateCache.get("expression-operand.html")
    };
} ]);