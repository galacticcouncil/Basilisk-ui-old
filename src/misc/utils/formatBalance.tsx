
const divmod = (dividend: number, divider: number) => {
    let quotient = Math.floor(dividend / divider);
    let remainder = dividend % divider;
    return [quotient, remainder];
}

// found on World Wide Web.
// It is just to format very small number from scientific notation to eg. 0.00000001
// TODO: perhaps there is an easier/another way?
const eToNumber = (num: any) => {
    let sign = "";
    (num += "").charAt(0) === "-" && (num = num.substring(1), sign = "-");
    let arr = num.split(/[e]/ig);
    if (arr.length < 2) return sign + num;
    let dot = (.1).toLocaleString().substr(1, 1), n = arr[0], exp = +arr[1],
        w = (n = n.replace(/^0+/, '')).replace(dot, ''),
        pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
        L   = pos - w.length, s = "" + BigInt(w);
    w   = exp >= 0 ? (L >= 0 ? s + "0".repeat(L) : r()) : (pos <= 0 ? "0" + dot + "0".repeat(Math.abs(pos)) + s : r());
    L= w.split(dot); // @ts-ignore
    if ( (L[0]===0 && L[1]===0) || (+w===0 && +s===0) ) w = 0;
    return sign + w;
    function r() {return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`)}
}

export const formatBalance = (balance: number, balancePrecision: number, outputDecimals: number) => {

    const units = ['', 'K', 'M', 'B', 'T'] // Perhaps this could be configurable
    const decimals = Math.min(outputDecimals, 3); // support for max 3 output decimals for now

    // Shortcut for 0
    if ( balance === 0 ){
        return "0";
    }

    // Let's work with positive numbers only
    let neg = balance < 0 ? '-' : '';
    let value = Math.abs(balance);

    // Work out precision
    let precision = Math.pow(10, balancePrecision);

    // Split into balance quotient and balance remainder
    let [balanceQ, balanceFrac] = divmod(value,precision);

    let unit = '';
    let amount: string | number = balanceFrac / Math.pow(10, balancePrecision - 3);
    let fracAmount = '';

    if (balanceQ === 0 )
    {
        // Balance is less than 1
        // Let's handle this separately
        // Print the whole number for now

        amount = eToNumber( balanceFrac / precision);
    }else {
        let frac = 0;
        let idx = 0;

        while ( balanceQ > 0 && idx < units.length){
            frac = amount;
            [balanceQ, amount] = divmod(balanceQ, 1000);
            unit = units[idx];
            idx++;
        }

        if ( balanceQ > 0){
            // Bigger than supported
            // Display the rest with the last unit - no decimals in this case
            amount = balanceQ * 1000 + amount;
        }
        else if ( frac > 0 && decimals > 0 ){
            let f = Math.floor(frac / Math.pow(10, 3 - decimals));
            fracAmount= `,${f}`;
        }
    }

    return `${neg}${amount}${fracAmount}${unit}`;
}
