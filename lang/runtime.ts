interface INum {
    value:number,
    add:(b:INum)=>INum,
};
export const Num=(value:number):INum=>({
    value,
    add(b:INum):INum {
        return Num(value+b.value);
    },
});

interface IStr {
    value:string;
    add:(b:IStr)=>IStr,
};
export const Str=(value:string):IStr=>({
    value,
    add(b:IStr) {
        return Str(value+b.value);
    },
});
