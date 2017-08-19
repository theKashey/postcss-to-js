let parse;_f29‍.w('../src/ast',[["default",function(v){parse=v}]]);let toStyled;_f29‍.w('../src/toStyled',[["default",function(v){toStyled=v}]]);


const CSS = `
/**
 * Paste or drop some CSS here and explore
 * the syntax tree created by chosen parser.
 * Enjoy!
 */

@font-face {
 font-family: "Open Sans";
 src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
        url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}

.button.spinner:before, button.spinner:before {
    margin-top: -.5em;
    margin-left: -.5em;
    width: 1em;
    height: 1em
}

@media screen and (min-width: 480px) {
    body {
        background-color: lightgreen;
    }
    
    .testtest {
        z-index:1;
    }
}

@media screen and (max-width: 480px) {
    body {
        background-color: lightgreen;
    }
    
    .testtest {
        z-index:1;
    }
}

#main {
    border: 1px solid black;
}

ul {
 border:1px;
}

ul:hover {
 border:2px;
}

ul li {
	padding: 5px;
}`;

const data = parse(CSS);
console.log(data);
console.log(toStyled(data));