"use strict";

angular.module("ngEquation", [ "ui.bootstrap", "ngEquation.templates" ]), angular.module("ngEquation").controller("EquationCtrl", [ "$filter", "UnknownOperandClassException", function($filter, UnknownOperandClassException) {
    function loadOperand(operand) {
        if (operand.operands) angular.forEach(operand.operands, function(childOperand) {
            loadOperand(childOperand);
        }); else {
            var matchingOperandConfig = $filter("filter")(ctrl.options.availableOperands, {
                class: operand.class
            })[0];
            if (angular.isUndefined(matchingOperandConfig)) throw new UnknownOperandClassException(operand.class);
            angular.extend(operand, matchingOperandConfig);
        }
    }
    var ctrl = this;
    if (ctrl.topLevelGroup = {
        operator: "AND",
        operands: [],
        onReady: function(groupApi) {
            ctrl.groupApi = groupApi;
        }
    }, ctrl.value = function() {
        var value;
        return ctrl.groupApi && (value = ctrl.groupApi.value()), value;
    }, ctrl.formula = function() {
        var formula;
        return ctrl.groupApi && (formula = ctrl.groupApi.formula()), formula;
    }, ctrl.loadEquation = function(equation) {
        ctrl.topLevelGroup.operator = equation.operator;
        var operands = angular.copy(equation.operands);
        angular.forEach(operands, function(operand) {
            loadOperand(operand);
        }), ctrl.topLevelGroup.operator = equation.operator, ctrl.topLevelGroup.operands = operands;
    }, angular.isFunction(ctrl.onReady)) {
        var equationApi = {
            value: ctrl.value,
            formula: ctrl.formula,
            loadEquation: ctrl.loadEquation
        };
        ctrl.onReady({
            equationApi: equationApi
        });
    }
} ]).directive("equation", [ "$templateCache", function($templateCache) {
    return {
        restrict: "EA",
        scope: {},
        transclude: {
            toolboxLabel: "?toolboxLabel"
        },
        bindToController: {
            options: "=equationOptions",
            class: "@equationClass",
            onReady: "&"
        },
        controller: "EquationCtrl",
        controllerAs: "equation",
        template: $templateCache.get("equation.html")
    };
} ]), angular.module("ngEquation").factory("MissingOperandOptionException", function() {
    function MissingOperandOptionException(property) {
        this.message = 'Operand options missing required property "' + property + '".', 
        this.stack = new Error().stack;
    }
    return MissingOperandOptionException.prototype = Object.create(Error.prototype), 
    MissingOperandOptionException.prototype.constructor = MissingOperandOptionException, 
    MissingOperandOptionException.prototype.name = "MissingOperandOptionException", 
    MissingOperandOptionException;
}), angular.module("ngEquation").factory("OperandOptionTypeException", function() {
    function OperandOptionTypeException(property, expectedType, propertyType) {
        this.message = 'Operand options property "' + property + '" is incorrect type. Expected: "' + expectedType + '". Got: "' + propertyType + '".', 
        this.stack = new Error().stack;
    }
    return OperandOptionTypeException.prototype = Object.create(Error.prototype), OperandOptionTypeException.prototype.constructor = OperandOptionTypeException, 
    OperandOptionTypeException.prototype.name = "OperandOptionTypeException", OperandOptionTypeException;
}), angular.module("ngEquation").factory("UnknownOperandClassException", function() {
    function UnknownOperandClassException(className) {
        this.message = 'Available operands does not include an operand with class "' + className + '".', 
        this.stack = new Error().stack;
    }
    return UnknownOperandClassException.prototype = Object.create(Error.prototype), 
    UnknownOperandClassException.prototype.constructor = UnknownOperandClassException, 
    UnknownOperandClassException.prototype.name = "UnknownOperandClassException", UnknownOperandClassException;
}), angular.module("ngEquation").controller("ExpressionGroupCtrl", function() {
    function getValue(operand) {
        var value;
        return value = ctrl.isSubgroup(operand) ? {
            operator: operand.operator,
            operands: operand.operands.map(function(childOperand) {
                return getValue(childOperand);
            })
        } : {
            class: operand.class,
            value: operand.value,
            label: operand.getLabel(operand)
        };
    }
    function getFormula(operands, operator) {
        var operandFormulas = [];
        angular.forEach(operands, function(operand) {
            ctrl.isSubgroup(operand) ? operandFormulas.push([ "(", getFormula(operand.operands, operand.operator), ")" ].join("")) : operandFormulas.push(operand.getLabel(operand));
        });
        var prefix = "";
        return "AND NOT" === operator && (prefix = "NOT "), prefix + operandFormulas.join(" " + operator + " ");
    }
    var ctrl = this;
    if (ctrl.addOperand = function(operand) {
        ctrl.operands.push(angular.copy(operand));
    }, ctrl.addSubgroup = function() {
        ctrl.addOperand({
            operator: "AND",
            operands: []
        });
    }, ctrl.isSubgroup = function(operand) {
        return !!operand.operands;
    }, ctrl.getIndexOfOperand = function(operand) {
        if (!ctrl.isSubgroup(operand)) for (var i = 0, len = ctrl.operands.length; i < len; i++) if (!ctrl.isSubgroup(ctrl.operands[i]) && ctrl.operands[i].value === operand.value) return i;
        return -1;
    }, ctrl.removeSubgroup = function(subgroupId) {
        ctrl.operands.splice(subgroupId, 1);
    }, ctrl.removeOperand = function(operand) {
        var operandIndex = ctrl.getIndexOfOperand(operand);
        operandIndex !== -1 && ctrl.operands.splice(operandIndex, 1);
    }, ctrl.value = function() {
        return {
            operator: ctrl.operator,
            operands: ctrl.operands.map(function(operand) {
                return getValue(operand);
            })
        };
    }, ctrl.formula = function() {
        return getFormula(ctrl.operands, ctrl.operator);
    }, angular.isFunction(ctrl.onReady)) {
        var groupApi = {
            value: ctrl.value,
            formula: ctrl.formula
        };
        ctrl.onReady({
            groupApi: groupApi
        });
    }
}).directive("expressionGroup", [ "$compile", "$templateCache", "expressionGroupDragNDrop", function($compile, $templateCache, expressionGroupDragNDrop) {
    return {
        restrict: "EA",
        scope: {},
        bindToController: {
            parent: "=?",
            subgroupId: "@",
            operator: "=",
            operands: "=",
            availableOperands: "=",
            onReady: "&"
        },
        controller: "ExpressionGroupCtrl",
        controllerAs: "group",
        compile: function(cElement) {
            var compiledContents, contents = cElement.contents().remove();
            return {
                post: function(scope, element) {
                    compiledContents || (compiledContents = $compile(contents)), compiledContents(scope, function(clone) {
                        element.append(clone);
                    }), expressionGroupDragNDrop.setup(scope, element);
                }
            };
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
} ]), angular.module("ngEquation").factory("operandOptions", [ "MissingOperandOptionException", "OperandOptionTypeException", function(MissingOperandOptionException, OperandOptionTypeException) {
    var operandOptionsApi = {
        class: {
            type: "string",
            required: !0
        },
        typeLabel: {
            type: "string",
            required: !0
        },
        editMetadata: {
            type: "function",
            required: !0
        },
        getLabel: {
            type: "function",
            required: !0
        },
        getTooltipText: {
            type: "function",
            required: !1
        }
    };
    return {
        validate: function(obj) {
            angular.forEach(operandOptionsApi, function(propertyOptions, propertyName) {
                if (propertyOptions.required && !(propertyName in obj)) throw new MissingOperandOptionException(propertyName);
                if (propertyName in obj && typeof obj[propertyName] !== propertyOptions.type) throw new OperandOptionTypeException(propertyName, propertyOptions.type, typeof obj[propertyName]);
            });
        }
    };
} ]).controller("ExpressionOperandCtrl", [ "$q", "$log", "operandOptions", function($q, $log, operandOptions) {
    function addAdditionalOperands(values) {
        ctrl.group ? angular.forEach(values, function(value) {
            var newOperand = angular.copy(ctrl.options);
            newOperand.value = value, ctrl.group.addOperand(newOperand);
        }) : $log.error("unable to add additional operands because there is no group");
    }
    var ctrl = this;
    operandOptions.validate(ctrl.options);
    var isValueInitialized = angular.isDefined(ctrl.options.value);
    ctrl.removeFromGroup = function() {
        ctrl.group && ctrl.group.removeOperand(ctrl.options);
    }, ctrl.editMetadata = function() {
        var editResult = ctrl.options.editMetadata(ctrl.options);
        $q.when(editResult).then(function(result) {
            var value = result && result.value, addMultiple = result && result.addMultiple;
            angular.isDefined(value) ? (angular.isArray(value) && addMultiple ? (ctrl.options.value = value[0], 
            addAdditionalOperands(value.slice(1))) : !angular.isArray(value) && addMultiple ? $log.error('editMetadata must return an array when using the "addMultiple" option') : ctrl.options.value = value, 
            isValueInitialized = !0) : isValueInitialized ? $log.warn("editMetadata resulted in undefined value, operand will retain previous value of " + ctrl.options.value) : ctrl.removeFromGroup();
        }, function() {
            isValueInitialized || ctrl.removeFromGroup();
        });
    }, ctrl.group && angular.isUndefined(ctrl.options.value) && ctrl.editMetadata(ctrl.options);
} ]).directive("expressionOperand", [ "$templateCache", "expressionOperandDragNDrop", function($templateCache, expressionOperandDragNDrop) {
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
            expressionOperandDragNDrop.setup(scope, element);
        },
        template: $templateCache.get("expression-operand.html")
    };
} ]), angular.module("ngEquation").factory("expressionGroupDragNDrop", [ "$window", function($window) {
    return {
        setup: function(scope, element) {
            $window.interact(element.find(".eq-new-operand")[0]).dropzone({
                accept: ".eq-operand",
                overlap: .1,
                checker: function(_dragEvent, _event, dropped, _dropZone, dropElement, _draggable, draggableElement) {
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
                    var dropRect = $window.interact.getElementRect(event.target), dropCenter = {
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
        }
    };
} ]), angular.module("ngEquation").factory("expressionOperandDragNDrop", [ "$window", function($window) {
    return {
        setup: function(scope, element) {
            var operandElement = element.find(".eq-operand")[0];
            $window.interact(operandElement).draggable({
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
                        var rect = $window.interact.getElementRect(event.target);
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
                checker: function(_dragEvent, _event, dropped, _dropZone, dropElement, _draggable, draggableElement) {
                    var existingOperandScope = angular.element(dropElement).scope();
                    if (existingOperandScope) {
                        var existingOperandCtrl = existingOperandScope.operand;
                        if (dropped && existingOperandCtrl) {
                            var newOperandCtrl = angular.element(draggableElement).scope().operand;
                            return dropped && existingOperandCtrl.options.value !== newOperandCtrl.options.value;
                        }
                    }
                    return !1;
                },
                ondropactivate: function(event) {
                    event.target.classList.add("drop-active");
                },
                ondragenter: function(event) {
                    event.target.classList.add("drop-target"), event.relatedTarget.classList.add("can-drop");
                    var dropRect = $window.interact.getElementRect(event.target), dropCenter = {
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
        }
    };
} ]);