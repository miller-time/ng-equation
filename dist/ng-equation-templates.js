angular.module('ngEquation.templates', ['equation.html', 'expression-group.html', 'expression-operand-toolbox.html', 'expression-operand.html']);

angular.module("equation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("equation.html",
    "<span class=\"ng-equation\" ng-class=\"equation.class\">\n" +
    "\n" +
    "    <span class=\"eq-toolbox-container\">\n" +
    "        <span ng-transclude=\"toolboxLabel\"\n" +
    "            class=\"eq-toolbox-label-container\">\n" +
    "            <label class=\"eq-toolbox-label\">\n" +
    "                Toolbox\n" +
    "            </label>\n" +
    "        </span>\n" +
    "        <expression-operand-toolbox\n" +
    "            class=\"eq-toolbox-group-container\"\n" +
    "            operands=\"equation.options.availableOperands\"\n" +
    "            default-group-api=\"equation.groupApi\"\n" +
    "            equation-options=\"equation.options\">\n" +
    "        </expression-operand-toolbox>\n" +
    "    </span>\n" +
    "\n" +
    "    <span class=\"eq-formula-container\">\n" +
    "        <span ng-transclude=\"formulaLabel\"\n" +
    "            class=\"eq-formula-label-container\">\n" +
    "            <label class=\"eq-formula-label\">\n" +
    "                Formula:\n" +
    "            </label>\n" +
    "        </span>\n" +
    "        <span>{{ equation.formula() }}</span>\n" +
    "    </span>\n" +
    "\n" +
    "    <span class=\"top-level-group\">\n" +
    "        <expression-group\n" +
    "            operator=\"equation.topLevelGroup.operator\"\n" +
    "            operands=\"equation.topLevelGroup.operands\"\n" +
    "            on-ready=\"equation.topLevelGroup.onReady(groupApi)\"\n" +
    "            available-operands=\"equation.options.availableOperands\"\n" +
    "            equation-options=\"equation.options\">\n" +
    "        </expression-group>\n" +
    "    </span>\n" +
    "\n" +
    "</span>\n" +
    "");
}]);

angular.module("expression-group.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("expression-group.html",
    "<span class=\"eq-group\">\n" +
    "\n" +
    "    <span ng-repeat-start=\"operand in group.operands\"\n" +
    "        class=\"eq-operand-container\"\n" +
    "        ng-class=\"{'eq-group-container': operand.operands}\">\n" +
    "        <span ng-if=\"$first && group.operator === 'AND NOT'\" class=\"eq-operator\">\n" +
    "            NOT\n" +
    "        </span>\n" +
    "\n" +
    "        <!-- subgroup -->\n" +
    "        <span ng-if=\"operand.operands\">\n" +
    "            <expression-group\n" +
    "                parent=\"group\"\n" +
    "                subgroup-id=\"{{$index}}\"\n" +
    "                operator=\"operand.operator\"\n" +
    "                operands=\"operand.operands\"\n" +
    "                available-operands=\"group.availableOperands\"\n" +
    "                equation-options=\"group.equationOptions\">\n" +
    "            </expression-group>\n" +
    "        </span>\n" +
    "\n" +
    "        <!-- not subgroup -->\n" +
    "        <span ng-if=\"!operand.operands\">\n" +
    "            <expression-operand\n" +
    "                group=\"group\"\n" +
    "                operand-options=\"operand\"\n" +
    "                equation-options=\"group.equationOptions\">\n" +
    "            </expression-operand>\n" +
    "        </span>\n" +
    "    </span>\n" +
    "\n" +
    "    <div ng-repeat-end class=\"btn-group\" uib-dropdown ng-if=\"!$last\">\n" +
    "        <button class=\"eq-operator btn\" uib-dropdown-toggle>\n" +
    "            {{group.operator}} <span class=\"caret\"></span>\n" +
    "        </button>\n" +
    "        <ul class=\"dropdown-menu\" uib-dropdown-menu>\n" +
    "            <li ng-class=\"{'active': group.operator === 'AND'}\">\n" +
    "                <a href ng-click=\"group.operator = 'AND'\">\n" +
    "                    AND\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-class=\"{'active': group.operator === 'OR'}\">\n" +
    "                <a href ng-click=\"group.operator = 'OR'\">\n" +
    "                    OR\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-class=\"{'active': group.operator === 'AND NOT'}\">\n" +
    "                <a href ng-click=\"group.operator = 'AND NOT'\">\n" +
    "                    AND NOT\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"btn-group\" uib-dropdown>\n" +
    "        <button class=\"eq-new-operand btn\" uib-dropdown-toggle>\n" +
    "            <i ng-class=\"group.equationOptions.iconAddClass\"></i>\n" +
    "            <span class=\"caret\"></span>\n" +
    "        </button>\n" +
    "        <ul class=\"dropdown-menu\" uib-dropdown-menu>\n" +
    "            <li ng-repeat=\"availableOperand in group.availableOperands\"\n" +
    "                ng-class=\"availableOperand.class\"\n" +
    "                class=\"eq-operand-menu-item\">\n" +
    "                <a href ng-click=\"group.addOperand(availableOperand)\">\n" +
    "                    {{availableOperand.typeLabel || 'Add Subgroup'}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li>\n" +
    "                <a href ng-click=\"group.addSubgroup()\">\n" +
    "                    Add Subgroup\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "\n" +
    "    <button class=\"eq-remove-group\"\n" +
    "        ng-if=\"group.parent\"\n" +
    "        ng-click=\"group.parent.removeSubgroup(group.subgroupId)\">\n" +
    "        Remove Group\n" +
    "    </button>\n" +
    "</span>\n" +
    "");
}]);

angular.module("expression-operand-toolbox.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("expression-operand-toolbox.html",
    "<span class=\"eq-toolbox\">\n" +
    "    <span ng-repeat=\"operand in toolbox.operands\">\n" +
    "        <expression-operand\n" +
    "            operand-options=\"operand\"\n" +
    "            default-group-api=\"toolbox.defaultGroupApi\"\n" +
    "            equation-options=\"toolbox.equationOptions\">\n" +
    "        </expression-operand>\n" +
    "    </span>\n" +
    "</span>\n" +
    "");
}]);

angular.module("expression-operand.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("expression-operand.html",
    "<span style=\"display: inline-block\">\n" +
    "    <span class=\"eq-operand btn-group\"\n" +
    "          style=\"display: inline-block\"\n" +
    "          ng-class=\"operand.options.class\"\n" +
    "          uib-tooltip=\"{{ operand.options.getTooltipText(operand.options) }}\"\n" +
    "          tooltip-placement=\"{{operand.options.tooltipPlacement || 'bottom'}}\"\n" +
    "          tooltip-append-to-body=\"true\">\n" +
    "\n" +
    "        <span class=\"btn eq-operand-drag-btn\">\n" +
    "            <i ng-class=\"operand.equationOptions.iconDragClass\"></i>\n" +
    "            <span class=\"eq-operand-label\">\n" +
    "                <span ng-if=\"operand.options.value\">\n" +
    "                    {{operand.options.getLabel(operand.options)}}\n" +
    "                </span>\n" +
    "                <span ng-if=\"!operand.options.value\">\n" +
    "                    {{operand.options.typeLabel}}\n" +
    "                </span>\n" +
    "            </span>\n" +
    "        </span>\n" +
    "\n" +
    "        <span class=\"btn eq-operand-click-to-add\"\n" +
    "              ng-if=\"operand.defaultGroupApi\"\n" +
    "              ng-click=\"operand.addToDefaultGroup()\">\n" +
    "            <i ng-class=\"operand.equationOptions.iconAddClass\"></i>\n" +
    "        </span>\n" +
    "\n" +
    "        <button class=\"eq-edit-operand\"\n" +
    "            ng-if=\"operand.options.value\"\n" +
    "            ng-click=\"operand.editMetadata()\">\n" +
    "            <i ng-class=\"operand.equationOptions.iconEditClass\"></i>\n" +
    "        </button>\n" +
    "\n" +
    "        <button class=\"eq-remove-operand\"\n" +
    "            ng-if=\"operand.group\"\n" +
    "            ng-click=\"operand.removeFromGroup()\">\n" +
    "            <i ng-class=\"operand.equationOptions.iconRemoveClass\"></i>\n" +
    "        </button>\n" +
    "    </span>\n" +
    "</span>\n" +
    "");
}]);
