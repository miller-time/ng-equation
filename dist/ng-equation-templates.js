angular.module('ngEquation.templates', ['equation.html', 'expression-group.html', 'expression-operand-toolbox.html', 'expression-operand.html']);

angular.module("equation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("equation.html",
    "<span class=\"eq-equation\">\n" +
    "\n" +
    "    <span class=\"eq-toolbox-container\">\n" +
    "        <label class=\"eq-toolbox-label\">\n" +
    "            Toolbox\n" +
    "        </label>\n" +
    "        <expression-operand-toolbox\n" +
    "            operands=\"equation.options.availableOperands\">\n" +
    "        </expression-operand-toolbox>\n" +
    "    </span>\n" +
    "\n" +
    "    <span class=\"top-level-group\">\n" +
    "        <expression-group\n" +
    "            operator=\"{{equation.topLevelGroup.operator}}\"\n" +
    "            operands=\"equation.topLevelGroup.operands\"\n" +
    "            available-operands=\"equation.options.availableOperands\">\n" +
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
    "    <span ng-repeat=\"operand in group.operands\">\n" +
    "        <span ng-if=\"$first && group.operator === 'AND NOT'\" class=\"eq-operator\">\n" +
    "            NOT\n" +
    "        </span>\n" +
    "\n" +
    "        <!-- subgroup -->\n" +
    "        <span ng-if=\"operand.operands\">\n" +
    "            <expression-group\n" +
    "                parent=\"group\"\n" +
    "                subgroup-id=\"{{$index}}\"\n" +
    "                operator=\"{{operand.operator}}\"\n" +
    "                operands=\"operand.operands\"\n" +
    "                available-operands=\"group.availableOperands\">\n" +
    "            </expression-group>\n" +
    "        </span>\n" +
    "\n" +
    "        <!-- not subgroup -->\n" +
    "        <span ng-if=\"!operand.operands\">\n" +
    "            <expression-operand\n" +
    "                group=\"group\"\n" +
    "                operand-options=\"operand\">\n" +
    "            </expression-operand>\n" +
    "        </span>\n" +
    "\n" +
    "        <div class=\"btn-group\" uib-dropdown ng-if=\"!$last\">\n" +
    "            <button class=\"eq-operator btn\" uib-dropdown-toggle>\n" +
    "                {{group.operator}} <span class=\"caret\"></span>\n" +
    "            </button>\n" +
    "            <ul class=\"dropdown-menu\" uib-dropdown-menu>\n" +
    "                <li ng-class=\"{'active': group.operator === 'AND'}\">\n" +
    "                    <a href ng-click=\"group.operator = 'AND'\">\n" +
    "                        AND\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li ng-class=\"{'active': group.operator === 'OR'}\">\n" +
    "                    <a href ng-click=\"group.operator = 'OR'\">\n" +
    "                        OR\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "                <li ng-class=\"{'active': group.operator === 'AND NOT'}\">\n" +
    "                    <a href ng-click=\"group.operator = 'AND NOT'\">\n" +
    "                        AND NOT\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </span>\n" +
    "\n" +
    "    <div class=\"btn-group\" uib-dropdown>\n" +
    "        <button class=\"eq-new-operand btn\" uib-dropdown-toggle>\n" +
    "            &#10133; <span class=\"caret\"></span>\n" +
    "        </button>\n" +
    "        <ul class=\"dropdown-menu\" uib-dropdown-menu>\n" +
    "            <li ng-repeat=\"availableOperand in group.availableOperands\"\n" +
    "                ng-class=\"availableOperand.class\"\n" +
    "                class=\"eq-operand-menu-item\">\n" +
    "                <a href ng-click=\"group.addOperand(availableOperand)\">\n" +
    "                    {{availableOperand.label || 'Add Subgroup'}}\n" +
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
    "\n" +
    "    <span ng-repeat=\"operand in toolbox.operands\">\n" +
    "\n" +
    "        <expression-operand\n" +
    "            operand-options=\"operand\">\n" +
    "        </expression-operand>\n" +
    "\n" +
    "    </span>\n" +
    "\n" +
    "</span>\n" +
    "");
}]);

angular.module("expression-operand.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("expression-operand.html",
    "<span style=\"display: inline-block\">\n" +
    "    <span class=\"eq-operand\" style=\"display: inline-block\"\n" +
    "        ng-class=\"operand.options.class\">\n" +
    "        {{operand.options.label}}\n" +
    "\n" +
    "        <button class=\"eq-remove-operand\"\n" +
    "            ng-if=\"operand.group\"\n" +
    "            ng-click=\"operand.removeFromGroup()\">\n" +
    "            &times;\n" +
    "        </button>\n" +
    "    </span>\n" +
    "</span>\n" +
    "");
}]);
