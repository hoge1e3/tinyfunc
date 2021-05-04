import { ValueExpression, NumberLiteral, Identifier, MemberAccess, Call, StringLiteral } from "./Expressions";
import { Type, stringType, numberType, StructType, Member } from "./Types";

function invalid(s:never){return new Error("${s} is invalid");}
const numberTypeMembers=new Set(["add","sub"]);
export function getType(expr: ValueExpression):Type {
    if (expr instanceof StringLiteral) {
        return stringType;
    } else {
        return numberType;
    }
}
export function getMember(type:StructType, name:Identifier):Member {
    for (const member of type.members) {
        if (member.name.text===name.text) return member;
    }
    //throw new SemanticError("member is not defined");
    throw new SemanticError("member ", name.text, "is not defined in type ",type.name.text);
}
export function check(expr: ValueExpression) {
    const E=(...messages:any[])=>new SemanticError( ...messages);
    console.log("Checking", expr);
    if (expr instanceof NumberLiteral) {
    } else if (expr instanceof StringLiteral) {//追加
    } else if (expr instanceof Identifier) {
    } else if (expr instanceof MemberAccess) {
        check(expr.left);
        const leftType=getType(expr.left);
        getMember(leftType, expr.name);
        /*if (!numberTypeMembers.has(expr.name.text)) {
            throw E(expr.name.text, " is not defined");
        }*/
    } else if (expr instanceof Call) {
        check(expr.left);
    } else {
        throw invalid(expr);
    }
}
export class SemanticError extends Error {
    public messages:any[];
    constructor(...messages:any[]) {
        super("SemanticError: "+messages.join(" "));
        this.messages=messages;
    }
}
