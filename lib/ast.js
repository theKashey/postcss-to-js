'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getAtRule = function getAtRule(rule) {
  if (rule && rule.parent && rule.parent.name == 'media') {
    return getAtRule(rule.parent).concat(rule.parent.params);
  }
  return [];
};

var getBreak = function getBreak(rule) {
  var breakPoints = [rule.indexOf(' '), rule.indexOf('>'), rule.indexOf('~'), rule.indexOf('+'), rule.indexOf(':')].filter(function (index) {
    return index > 0;
  });
  if (breakPoints.length == 0) {
    return rule.length;
  }
  var min = Math.min.apply(Math, _toConsumableArray(breakPoints));
  return min ? min : rule.length;
};

var getPostfix = function getPostfix(rule) {
  return rule.substr(getBreak(rule)).trim();
};

var getPrefix = function getPrefix(rule) {
  return rule.substr(0, getBreak(rule)).trim();
};

var buildAst = function buildAst(CSS) {
  var root = _postcss2.default.parse(CSS);
  var selectors = {};
  root.walkAtRules(function (rule) {
    if (rule.name != 'media') {
      var topName = rule.name;
      var Rule = {
        rule: rule,
        selector: '@' + rule.name + ' ' + rule.params,
        isGlobal: true,
        media: getAtRule(rule),
        decl: []
      };
      rule.walkDecls(function (delc) {
        Rule.decl.push(delc);
      });
      var sel = selectors[topName] || [];
      sel.push(Rule);
      selectors[topName] = sel;
    }
  });

  root.walkRules(function (rule) {
    var ruleSelectors = rule.selector.split(',');
    ruleSelectors.map(function (sel) {
      return sel.trim();
    }).forEach(function (selector) {
      var topName = getPrefix(selector);
      var Rule = {
        media: getAtRule(rule),
        postFix: getPostfix(selector),
        decl: []
      };
      rule.walkDecls(function (delc) {
        Rule.decl.push(delc);
      });
      var sel = selectors[topName] || [];
      sel.push(Rule);
      selectors[topName] = sel;
    });
  });

  return selectors;
};

exports.default = buildAst;