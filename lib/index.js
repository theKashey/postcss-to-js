'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toStyled = exports.parseAst = undefined;

var _ast = require('./ast');

var _ast2 = _interopRequireDefault(_ast);

var _toStyled = require('./toStyled');

var _toStyled2 = _interopRequireDefault(_toStyled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CSS = '\n  :root {\n    root:1\n  }\n  \n  a{\n    b:2\n  }\n';

exports.parseAst = _ast2.default;
exports.toStyled = _toStyled2.default;