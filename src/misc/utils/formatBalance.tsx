
const divmod = (divident: number, divider: number) => {
    let quotient = Math.floor(divident / divider);
    let remainder = divident % divider;
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
    if ( (L[0]===0 && L[1]===0) || (+w===0 && +s===0) ) w = 0; //** added 9/10/2021
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

    // get digits count - works correctly only for positive values
    let length = Math.log(value) * Math.LOG10E + 1 ;

    // Work out precision
    let precision = Math.pow(10, balancePrecision);

    // Split into balance quotient and balance remainder
    let [balanceQ, balanceFrac] = divmod(value,precision);

    let [scaleQ, scaleR] = divmod(length - balancePrecision, 3);

    if (scaleQ > units.length) {
        // Bigger than supported
        let [q, ] = divmod(balanceQ, Math.pow(1000, 4));
        return `${neg}${q}T`;
    }else if (balanceQ === 0 ){
        // Balance is less than 1
        // Let's handle this separately
        // Print the whole number for now
        return `${neg}${(eToNumber(balanceFrac / precision))}`
    }
    else {
        let unit = '';
        let amount = 0;
        let frac_amount = '';

        if (scaleQ === 0 || (scaleQ === 1 && scaleR === 0)) {
            unit = units[0];
            amount = balanceQ;
        } else {
            if (scaleR > 0) {
                unit = units[scaleQ];
                let y = Math.pow(1000, scaleQ);
                amount = Math.floor(balanceQ / y);

                if (decimals > 0) {
                    let f = balanceQ % y;
                    let fp = Math.floor(f / Math.pow(1000, scaleQ- 1))
                    let fpp = Math.floor(fp / Math.pow(10, 3 - decimals));
                    frac_amount = `,${fpp}`
                }
            } else {
                unit = units[scaleQ - 1];
                let y = Math.pow(1000, scaleQ - 1);
                amount = Math.floor(balanceQ / Math.pow(1000, scaleQ - 1));
                if (decimals > 0) {
                    let f = balanceQ % y;
                    let fp = Math.floor(f / Math.pow(1000, scaleQ - 2))
                    let fpp = Math.floor(fp / Math.pow(10, 3 - decimals));
                    frac_amount = `,${fpp}`
                }
            }
        }
        return `${neg}${amount}${frac_amount}${unit}`
    }
}
