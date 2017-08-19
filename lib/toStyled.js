'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _namingConversion = require('./namingConversion');

var _namingConversion2 = _interopRequireDefault(_namingConversion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var escapeValue = function escapeValue(value, name) {
  if (name == 'content') return value.split('\\').join('\\\\');
  return value;
};

var rulesToString = function rulesToString(rules) {
  return rules.decl.map(function (rule) {
    return rule.prop + ': ' + escapeValue(rule.value, rule.prop) + ';';
  }).join('\n');
};

var addName = function addName(rule, next) {
  return rule.postFix ? '&' + rule.postFix + ' {' + next + '}' : next;
};
var addMedia = function addMedia(rule, next) {
  var lines = [];
  var media = rule.media;

  media.forEach(function (media) {
    return lines.push('@media ' + media + ' {');
  });
  lines.push(next);
  media.forEach(function (rule) {
    return lines.push('}');
  });
  return lines.join("\n");
};

var reduceRules = function reduceRules(rules) {
  return rules.map(function (rule) {
    return addName(rule, addMedia(rule, rulesToString(rule)));
  });
};

var globalRules = function globalRules(rules) {
  return rules.map(function (rule) {
    return rule.selector + ' { ' + rulesToString(rule) + ' }';
  }).join('\n');
};

var globalRule = function globalRule(rule) {
  return ['global_' + (0, _namingConversion2.default)('.' + rule[0].rule.name), '  () => injectGlobal`' + globalRules(rule) + '`'];
};

var toStyled = function toStyled(ast) {
  var result = [];
  var keys = Object.keys(ast);
  var hasRoot = false;
  var createRule = function createRule(rule) {
    if (ast[rule][0].isGlobal) {
      return globalRule(ast[rule], rule);
    } else {
      var jsName = (0, _namingConversion2.default)(rule);
      if (!(0, _namingConversion.isJSfriendly)(jsName)) return undefined;
      return [jsName, 'css`' + (hasRoot ? '${__root}; ' : '') + reduceRules(ast[rule]).join('\n') + '`;'];
    }
  };

  if (ast[':root']) {
    result.push(createRule(':root'));
    hasRoot = true;
  }

  return result.concat(keys.filter(function (name) {
    return name !== ':root';
  }).map(function (rule) {
    return createRule(rule);
  }).filter(function (value) {
    return !!value;
  }));
};

exports.default = toStyled;