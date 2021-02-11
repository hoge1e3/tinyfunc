export interface TreeRange{
    start:number;
    end:number;
    length:number;
}
export interface Tree {}
export interface Token extends Tree {
	text:string;
	type:string;
	source: string;
	range: TreeRange;
}
export function createToken(type: string, source:string, range:TreeRange):Token{
    return {
        type,source,range,text:source.substring(range.start, range.end)
    };
}
export function createTreeRange(start:number, end:number):TreeRange{
    return {
        start,end,length:end-start
    };
}
export function padRange(...r:TreeRange[]) {
    return createTreeRange( Math.min(...r.map(e=>e.start)), Math.max(...r.map(e=>e.end)));
}
export class ParseError extends Error {
    constructor(
        message: string,
        public pos:TreeRange) {
        super(message);
    }
}
