import * as fs from "fs";
import MyTokenizer from "./lang/MyTokenizer";
import MyParser from "./lang/MyParser";
import { generate } from "./lang/CodeGen";
import * as runtime from "./lang/runtime";
import { ParseError } from "./lib/TreeTypes";
for (let i=2;i<process.argv.length;i++) {
    test(process.argv[i]);
}
function test(srcFile:string) {
    const src=fs.readFileSync(srcFile,{encoding:"UTF-8"});
    try {
        run(src);
    }catch(e) {
        if (e instanceof ParseError) {
            const r=e.pos;
            console.log(src.substring(0,r.start)+">>>>"+src.substring(r.start,r.end)+"<<<<"+src.substring(r.end));
            console.log("Parse Error:", e.message);
        } else {
            console.error(e);
        }
    }
}
function run(src:string) {
    const t=MyTokenizer(src);
    const tokens=t.tokenize();
    tokens.forEach((token,i)=>console.log(`${i}:[${token.type}] ${token.text}`));
    const p=MyParser(tokens);
    const tree=p.parse();
    console.dir(tree, {depth:10});
    const js=`
    const {Num}=runtime;
    return ${generate(tree)};
    `;
    console.log(js);
    const func=new Function("runtime", js);
    const res=func(runtime);
    console.log(res);
}
