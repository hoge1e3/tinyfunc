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
