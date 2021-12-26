let aluZ

let variables = [
    { a:1 , b:10 , c:15 },
    { a:1 , b:12 , c:8 },
    { a:1 , b:15 , c:2 },
    { a:26 , b:-9 , c:6 },
    { a:1 , b:15 , c:13 },
    { a:1 , b:10 , c:4 },
    { a:1 , b:14 , c:1 },
    { a:26 , b:-5 , c:9 },
    { a:1 , b:14 , c:5 },
    { a:26 , b:-7 , c:13 },
    { a:26 , b:-12 , c:9 },
    { a:26 , b:-10 , c:6 },
    { a:26 , b:-1 , c:2 },
    { a:26 , b:-11 , c:2 },
]

const prevs = [];
const digits = [];

for ( let i = 0 ; i < variables.length ; i++ ) {
    const {a,b,c} = variables[i]
    console.log(i, variables[i])
    
    if (a === 1) {
        prevs.push([i, c]);
    } else {
        const [prevI, prevC] = prevs.pop();
        const complement = prevC + b;
        digits[prevI] = Math.min(9, 9 - complement)
        
        digits[i] = digits[prevI] + complement;
    }
    console.log("prevs :",prevs)
    console.log("digits :",digits)
}

console.log(digits.join(''));