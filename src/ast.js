import postcss  from 'postcss';

const getAtRule = (rule) => {
  if (rule && rule.parent && rule.parent.name == 'media') {
    return getAtRule(rule.parent).concat(rule.parent.params);
  }
  return [];
};

const getBreak = (rule) => {
  const breakPoints = [
    rule.indexOf(' '),
    rule.indexOf('>'),
    rule.indexOf('~'),
    rule.indexOf('+'),
    rule.indexOf(':'),
  ].filter(index => index > 0);
  if (breakPoints.length == 0) {
    return rule.length;
  }
  const min = Math.min(...breakPoints);
  return min ? min : rule.length;
};

const getPostfix = (rule) => {
  return rule.substr(getBreak(rule)).trim();
};

const getPrefix = (rule) => {
  return rule.substr(0, getBreak(rule)).trim();
};

const buildAst = (CSS) => {
  const root = postcss.parse(CSS);
  const selectors = {};
  root.walkAtRules(rule => {
    if (rule.name != 'media') {
      const topName = rule.name;
      const Rule = {
        rule: rule,
        selector: '@' + rule.name + ' ' + rule.params,
        isGlobal: true,
        media: getAtRule(rule),
        decl: []
      };
      rule.walkDecls(delc => {
        Rule.decl.push(delc);
      });
      const sel = selectors[topName] || [];
      sel.push(Rule);
      selectors[topName] = sel;
    }
  });

  root.walkRules(rule => {
    const ruleSelectors = rule.selector.split(',');
    ruleSelectors
      .map(sel => sel.trim())
      .forEach(selector => {
        const topName = getPrefix(selector);
        const Rule = {
          media: getAtRule(rule),
          postFix: getPostfix(selector),
          decl: [],
          ownProps: []
        };
        rule.walkDecls(delc => {
          Rule.decl.push(delc);
        });
        const sel = selectors[topName] || [];
        sel.push(Rule);
        selectors[topName] = sel;
      });
  });

  return selectors;
}


export default buildAst;
