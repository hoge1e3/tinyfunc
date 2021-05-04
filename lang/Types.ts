import { Identifier } from "./Expressions";

export class StructType {
    constructor(public name:Identifier, public members:Member[]) {}
}
export class Member {
    constructor(public name:Identifier) {}
}
export type Type=StructType;


const nMembers=[
    new Member(new Identifier("add")),
    new Member(new Identifier("sub")),
];
export const numberType=new StructType(new Identifier("Number"), nMembers);
const sMembers=[
    new Member(new Identifier("add")),
];
export const stringType=new StructType(new Identifier("String"), sMembers);
