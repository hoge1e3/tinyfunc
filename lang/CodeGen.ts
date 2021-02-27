import { ValueExpression, NumberLiteral, Identifier, MemberAccess, Call} from "./Expressions";

function invalid(s:never){return new Error("${s} is invalid");}
export function generate(expr:ValueExpression):string {
    const g=generate;
    if (expr instanceof NumberLiteral) {
        return `Num(${expr.value})`;
    } else if (expr instanceof Identifier) {
        return expr.text;
    } else if (expr instanceof MemberAccess) {
        return `${g(expr.left)}.${expr.name.text}`;
    } else if (expr instanceof Call) {
        const a=expr.args.map(g);
        return `${g(expr.left)}(${a.join(",")})`;
    } else {
        throw invalid(expr);
    }
}
