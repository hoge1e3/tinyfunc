import Tokenizer from "../lib/Tokenizer";
import {Token} from "../lib/TreeTypes";

export default function MyTokenizer(src:string) {
    const tokenizer:Tokenizer=new Tokenizer(src);
    function tokenize():Token[] {
        const tokens:Token[]=[];
        while(true) {
            tokenizer.skip(/^\s*/);
            if (tokenizer.eof()) return tokens;
            const token=
                tokenizer.read("number",/^[0-9]+/) ||
                tokenizer.read("lpar",/^\(/) ||
                tokenizer.read("rpar",/^\)/) ||
                tokenizer.read("dot",/^\./) ||
                tokenizer.read("comma",/^,/) ||
                tokenizer.read("identifier",/^[A-Za-z]+/) ||
                undefined;
            if (!token) throw new Error("Tokenizer error while reading "+tokenizer.head());
            else tokens.push(token);
        }
    }
    return {tokenize};
}
