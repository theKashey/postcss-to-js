import nameRule, {isJSfriendly, isReactFriendly} from './namingConversion';
import {isComponent, escapeValue, trimContent} from './utils';

const selfRule = (decl) => {
  switch (decl.prop) {
    case '--css-to-js-component':
      return '';

    case '--css-to-js-mixin':
      return trimContent(decl.value)
        .split(' ')
        .map(item => nameRule(item))
        .filter(name => !!name)
        .map(name => `\${${name}}`)
        .join(' ');

    default:
      return '';
  }
};

const createDecl = (decl) => {
  if (decl.prop.indexOf('--css-to-js') === 0) {
    return selfRule(decl);
  } else {
    return decl.prop + ': ' + escapeValue(decl.value, decl.prop) + ';'
  }
};

const declsToString = (rules) =>
  rules.decl
    .map(decl => createDecl(decl))
    .filter(decl => !!decl)
    .join('\n');

const addName = (rule, next) => rule.postFix ? `&${rule.postFix} {${next}}` : next;

const addMedia = (rule, next) => {
  const lines = [];
  const media = rule.media;

  media.forEach(media => lines.push(`@media ${media} {`));
  lines.push(next);
  media.forEach(rule => lines.push(`}`));
  return lines.join("\n");
};

const reduceRules = (rules) => {
  return rules.map(rule =>
    addName(rule,
      addMedia(rule,
        declsToString(rule)
      )
    )
  );
};

const globalRules = (rules) => (
  rules
    .map(rule => `${rule.selector} { ${declsToString(rule) } }`)
    .join('\n')
);

const globalRule = (rule) => {
  return ['global_' + nameRule('.' + rule[0].rule.name), `  () => injectGlobal\`${globalRules(rule)}\``];
};

const generateRule = (ast, ruleName, hasRoot) => {
  const componentDecl = isComponent(ast);
  if (componentDecl) {
    if (!isReactFriendly(nameRule(ruleName)[0])) {
      console.error('css-in-js: component-rule ', ruleName, ' must be un UpperCase.');
    }
    return `styled.${componentDecl.value}\`${hasRoot ? '${__root}; ' : ''}${reduceRules(ast).join('\n')}\`;`
  }
  return `css\`${hasRoot ? '${__root}; ' : ''}${reduceRules(ast).join('\n')}\`;`
};

const toStyled = (ast) => {
    const result = [];
    const keys = Object.keys(ast);
    let hasRoot = false;

    const createRule = rule => {
      if (ast[rule][0].isGlobal) {
        return globalRule(ast[rule], rule);
      } else {
        const jsName = nameRule(rule);
        if (!isJSfriendly(jsName)) return undefined;
        return (
          [jsName, generateRule(ast[rule], rule, hasRoot), rule]
        )
      }
    };

    if (ast[':root']) {
      result.push(createRule(':root'));
      hasRoot = true;
    }

    return result.concat(
      keys
        .filter(name => name !== ':root')
        .map(rule => createRule(rule))
        .filter(value => !!value)
    );
  }
;

export default toStyled;