var db = require("double-bits")
 
//More sophisticated example:  Print out base 2 representation
var pad = require("pad")
function base2Str(n) {
  var f = db.fraction(n)
  return (db.sign(n) ? "-" : "") +
    "2^" + (db.exponent(n)+1) +
    " * 0." + pad(f[1].toString(2), 20, "0") + 
              pad(f[0].toString(2), 32, "0")
}
console.log(base2Str(0.1))
console.log(base2Str(0.2))

// 2^-3 * 0.1100110011001100110011001100110011001100110011001101
// +
// 2^-3 * 1.1001100110011001100110011001100110011001100110011010

// 10.0110011001100110011001100110011001100110011001100111
// 转10进制2.4000000000000004D
// 2.4000000000000004 * 2^-3 = 0.30000000000000004 