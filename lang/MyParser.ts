import Parser from '../lib/Parser';
import { ValueExpression, NumberLiteral, Identifier, Call, MemberAccess, StringLiteral } from './Expressions';
import { Token } from '../lib/TreeTypes';

export default function MyParser(tokens:Token[]){
	const parser:Parser=new Parser(tokens);
	function parse() {
		try {
			const res=parseExpression();
			if (!parser.eot()) throw parser.parseError("Not EOF");
			return res;
		} catch (e) {
			if (parser.maxParseError) throw parser.maxParseError;
			else throw e;
		}
	}
	function parseExpression():ValueExpression {
		return parseApplication();
	}
	function parseElement():ValueExpression {
        if (parser.nextTokenIs("number")) return parseNumberLiteral();
		if (parser.nextTokenIs("string")) return parseStringLiteral();
        if (parser.nextTokenIs("identifier")) return parseIdentifier();
		throw parser.parseError();
	}
	function parseApplication():ValueExpression {
		let res=parseElement();
        while(true) {
            if (parser.nextTokenIs("lpar")) {
        		parser.readToken("lpar");
        		const args:ValueExpression[]=[parseExpression()];
        		parser.readToken("rpar");
        		res=new Call(res, args);
            } else if (parser.nextTokenIs("dot")) {
                parser.readToken("dot");
        		const ident=parseIdentifier();
        		res=new MemberAccess(res, ident);
            } else break;
        }
		return res;
	}
	function parseNumberLiteral():NumberLiteral {
		const t=parser.readToken("number");
		return new NumberLiteral(parseFloat(t.text));
	}
	function parseStringLiteral():StringLiteral {
		const t=parser.readToken("string");
		return new StringLiteral(t.text.replace(/^"/,"").replace(/"$/,""));
	}
	function parseIdentifier():Identifier {
		const t=parser.readToken("identifier");
		return new Identifier(t.text);
	}
	return {parse};
}
