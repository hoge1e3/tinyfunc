import {Token, ParseError,Tree} from "./TreeTypes";

export default class Parser {
	source:Token[];
	index:number;
	maxParseError?:ParseError;
	constructor(source:Token[]) {
		this.source=source;
		this.index=0;
	}
	eot() {
		return this.index>=this.source.length;
	}
	readToken(tokenType:string):Token {
		if (this.eot()) throw this.parseError("End of tokens");
		const curToken=this.source[this.index];
		const readType=curToken.type;
		if (readType===tokenType) {
			return this.source[this.index++];
		}
		//console.log(curToken);
		throw this.parseError(`Parse error: read ${this.index}:${readType}:${curToken.text} expected ${tokenType}`);
	}
	parseError(mesg:string="Parse Error") {
		const lastToken=this.source[Math.min(this.source.length-1,this.index)];
		const err=new ParseError(mesg, lastToken.range);
		if (!this.maxParseError || err.pos.start>this.maxParseError.pos.start) {
			this.maxParseError=err;
		}
		return err;
	}
	save() {
		return this.index;
	}
	restore(st:number) {
		this.index=st;
	}
	optional<T extends Tree>(func:()=>T):T|undefined {
		const sv=this.save();
		try {
			return func();
		} catch(e) {
			if (e instanceof ParseError){
				//console.log(e);
				this.restore(sv);
				return undefined;
			} else throw e;
		}
	}
	repeat<T extends Tree>(func:()=>T):T[] {
		const res:T[]=[];
		while(true) {
			const e=this.optional(func);
			if (!e) return res;
			res.push(e);
		}
	}
	or<T extends Tree>(...funcs:(()=>T)[]):T {
		const sv=this.save();
		let lastError:ParseError|undefined;
		for (const func of funcs) {
			try {
				return func();
			} catch(e) {
				if (e instanceof ParseError){
					//console.log(e);
					this.restore(sv);
					if(!lastError || e.pos>lastError.pos) lastError=e;
				} else throw e;
			}
		}
		throw lastError;
	}
}
