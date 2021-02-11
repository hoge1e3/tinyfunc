import {Token, createTreeRange, createToken} from "./TreeTypes";

export default class Tokenizer {
    eof() {
        return this.index>=this.source.length;
    }
	source:string;
	index:number;
	constructor(source:string) {
		this.source=source;
		this.index=0;
	}
	head():string {
		return this.source.substring(this.index);
	}
	skip(p:RegExp) {
		const m=p.exec(this.head());
		if (m) {
			this.forward(m[0].length);
		}
	}
	read(type:string, p:RegExp):Token|undefined {
		const m=p.exec(this.head());
		if (m) {
			const start=this.index;
			this.forward(m[0].length);
			return createToken(
                type, this.source,
                createTreeRange(start, this.index)
            );
		}
	}
	forward(by:number) {
		this.index+=by;
	}
}
