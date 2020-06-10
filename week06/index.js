function match(string) {
    let state = start;
    for (let item of string) {
        state = state(item);
        console.log(state, end)

    }
 
    return state === end
}

function start(string) {
    if (string === 'c')
        return foundc
    return start
}


function foundc(string) {
    if (string === 'h')
        return  foundh
    return start
}

function foundh(string) {
    if (string === 'r')
        return  end
    return start
}

function foundr(string) {
    if (string === 'i')
        return  foundi
    return start
}

function foundi(string) {
    if (string === 's')
        return  end
    return start
}

function end(string) {
    return end;
}

console.log(match('i am chris'))