export const isComponent = (rules) =>
  rules.reduce((component, rule) => (
    component
      ? component
      : rule.decl.find(decl => decl.prop === '--css-to-js-component')
  ), false);

export const escapeValue = (value, name) => {
  if (name == 'content') return value.split('\\').join('\\\\');
  return value;
};

export const trimContent = (str) =>
  str.startsWith('"')
    ? str.substring(1,str.length-1)
    : str;
