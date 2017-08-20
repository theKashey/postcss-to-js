'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _namingConversion = require('./namingConversion');

var _namingConversion2 = _interopRequireDefault(_namingConversion);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selfRule = function selfRule(decl) {
  switch (decl.prop) {
    case '--css-to-js-component':
      return '';

    case '--css-to-js-mixin':
      return (0, _utils.trimContent)(decl.value).split(' ').map(function (item) {
        return (0, _namingConversion2.default)(item);
      }).filter(function (name) {
        return !!name;
      }).map(function (name) {
        return '${' + name + '}';
      }).join(' ');

    default:
      return '';
  }
};

var createDecl = function createDecl(decl) {
  if (decl.prop.indexOf('--css-to-js') === 0) {
    return selfRule(decl);
  } else {
    return decl.prop + ': ' + (0, _utils.escapeValue)(decl.value, decl.prop) + ';';
  }
};

var declsToString = function declsToString(rules) {
  return rules.decl.map(function (decl) {
    return createDecl(decl);
  }).filter(function (decl) {
    return !!decl;
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
    return addName(rule, addMedia(rule, declsToString(rule)));
  });
};

var globalRules = function globalRules(rules) {
  return rules.map(function (rule) {
    return rule.selector + ' { ' + declsToString(rule) + ' }';
  }).join('\n');
};

var globalRule = function globalRule(rule) {
  return ['global_' + (0, _namingConversion2.default)('.' + rule[0].rule.name), '  () => injectGlobal`' + globalRules(rule) + '`'];
};

var generateRule = function generateRule(ast, ruleName, hasRoot) {
  var componentDecl = (0, _utils.isComponent)(ast);
  if (componentDecl) {
    if (!(0, _namingConversion.isReactFriendly)((0, _namingConversion2.default)(ruleName)[0])) {
      console.error('css-in-js: component-rule ', ruleName, ' must be un UpperCase.');
    }
    return 'styled.' + componentDecl.value + '`' + (hasRoot ? '${__root}; ' : '') + reduceRules(ast).join('\n') + '`;';
  }
  return 'css`' + (hasRoot ? '${__root}; ' : '') + reduceRules(ast).join('\n') + '`;';
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
      return [jsName, generateRule(ast[rule], rule, hasRoot), rule];
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