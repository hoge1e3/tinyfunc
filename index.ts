import * as fs from "fs";
import MyTokenizer from "./testlang/MyTokenizer";
//import Evaluator from "./testlang/Evaluator";
import MyParser from "./testlang/MyParser";
import { checkAndGetValueType, emptyContext, SemanticError } from "./testlang/TypeChecker";
import { generate } from "./testlang/CodeGen";
import * as jslib from "./jslib";
import { ParseError } from "./lib/TreeTypes";
//const config=fs.readFileSync("tsconfig.json",{encoding:"UTF-8"});
//const t=new MyTokenizer(" 12*2 - 20 / 4 -3");
//const srcFile=process.argv[2]||"tmp/test.txt";
for (let i=2;i<process.argv.length;i++) {
    test(process.argv[i]);
}
function test(srcFile:string) {
    const src=fs.readFileSync(srcFile,{encoding:"UTF-8"});
    try {
        run(src);
        if (srcFile.match(/error/)) {
            throw new Error(`${srcFile} should throw Error`);
        } else {
            console.log(`${srcFile} Ok`);
        }
    }catch(e) {
        if (e.message.match(/should throw Error/)) throw e;
        if (e instanceof SemanticError) {
            const r=e.range;
            console.log(src.substring(0,r.start)+">>>>"+src.substring(r.start,r.end)+"<<<<"+src.substring(r.end));
            console.log("Semantic Error:", ...e.messages);
            console.error(e);
        } else if (e instanceof ParseError) {
            const r=e.pos;
            console.log(src.substring(0,r.start)+">>>>"+src.substring(r.start,r.end)+"<<<<"+src.substring(r.end));
            console.log("Parse Error:", e.message);
            console.error(e);
        } else {
            console.error(e);
        }
        if (srcFile.match(/error/)) {
            console.log(`${srcFile} Failed Successfully`);
        } else {
            console.log(`${srcFile} Failed`);
            throw e;
        }
    }
}
function run(src:string) {
    const t=MyTokenizer(src);
    const tokens=t.tokenize();
    //tokens.forEach((token,i)=>console.log(`${i}:[${token.type}] ${token.text}`));
    const p=MyParser(tokens);
    const tree=p.parse();
    //console.log(tree);
    const type=checkAndGetValueType(tree, emptyContext());
    //console.log(type);
    const js=`
    const {Num,match,Bool,Str,Thunk,Case,eager}=jslib;
    return ${generate(tree)};
    `;
    console.log(js);
    const func=new Function("jslib", js);
    const resT=func(jslib);
    console.log(jslib.eager(resT));
    /*const e=new Evaluator();
    const res=e.evaluate(tree);
    console.log(res);
    */
}
