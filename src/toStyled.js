import nameRule, {isJSfriendly} from './namingConversion';

const escapeValue = (value, name) => {
  if(name=='content') return value.split('\\').join('\\\\');
  return value;
};

const rulesToString = (rules) =>
  rules.decl.map(rule => rule.prop + ': ' + escapeValue(rule.value, rule.prop) + ';').join('\n');

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
        rulesToString(rule)
      )
    )
  );
};

const globalRules = (rules) => (
  rules
    .map(rule => `${rule.selector} { ${rulesToString(rule) } }`)
    .join('\n')
);

const globalRule = (rule) => {
  return ['global_' + nameRule('.' + rule[0].rule.name), `  () => injectGlobal\`${globalRules(rule)}\``];
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
          [jsName, `css\`${hasRoot ? '${__root}; ' : ''}${reduceRules(ast[rule]).join('\n')}\`;`]
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