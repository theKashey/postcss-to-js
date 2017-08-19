import parseAst from './ast';
import toStyled from './toStyled';

const CSS = `
  :root {
    root:1
  }
  
  a{
    b:2
  }
`;

export {
  parseAst,
  toStyled
}