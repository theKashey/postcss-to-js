'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var reserved = ['styled', 'css', 'injectGlobal', 'require', 'export', 'module', 'abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'export', 'extends', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'];

var process_first = function process_first(name) {
  var c = name[0];
  switch (c) {
    case '#':
      return "$" + name.substr(1);
    case '.':
      return name.substr(1);
    case ':':
      return name;

    default:
      return 'tag_' + name;
  }
};

var escape = function escape(name) {
  var result = process_first(name);

  var subresult = result.split('--').join('$$').split('-').join('_').split(' ').join('__').split('.').join('_and_').split(':').join('$$').split('#').join('$');

  if (!isJSfriendly(subresult)) {
    if (isJSfriendly("_" + subresult)) {
      return "_" + subresult;
    }
  }
  return subresult;
};

var reserve = function reserve(name) {
  return reserved.indexOf(name) >= 0 ? name + "_$" : name;
};

var nameRule = function nameRule(name) {
  if (name === ':root') {
    return '__root';
  }
  return reserve(escape(name));
};

var isJSfriendly = exports.isJSfriendly = function isJSfriendly(name) {
  return (/^[a-z_\$][\w\$]*$/i.test(name)
  );
};
var isReactFriendly = exports.isReactFriendly = function isReactFriendly(name) {
  return (/^[A-Z]/.test(name)
  );
};

exports.default = nameRule;