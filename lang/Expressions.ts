import { Tree } from "../lib/TreeTypes";

export class NumberLiteral {
    constructor(public value:number){}
}
export class StringLiteral {
    constructor(public value:string){}
}
export class Identifier {
    constructor(public text:string){}
    toString() {return this.text;}
}
export class MemberAccess {
    constructor(public left:ValueExpression, public name:Identifier){}
}
export class Call {
    constructor(public left:ValueExpression, public args:ValueExpression[]){}
}
export type ValueExpression=NumberLiteral|Identifier|MemberAccess|Call|StringLiteral;
