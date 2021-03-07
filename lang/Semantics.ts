import { ValueExpression, NumberLiteral, Identifier, MemberAccess, Call } from "./Expressions";

function invalid(s:never){return new Error("${s} is invalid");}
const numberTypeMembers=new Set(["add","sub"]);
export function check(expr: ValueExpression) {
    const E=(...messages:any[])=>new SemanticError( ...messages);
    console.log("Checking", expr);
    if (expr instanceof NumberLiteral) {
    } else if (expr instanceof Identifier) {
    } else if (expr instanceof MemberAccess) {
        //check(expr.left);
        if (!numberTypeMembers.has(expr.name.text)) {
            throw E(expr.name.text, " is not defined");
        }
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
