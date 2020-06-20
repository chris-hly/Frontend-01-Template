function kmpGetStrPartMatchValue(str) {
    var prefix = [];
    var suffix = [];
    var partMatch = [];
    for (var i = 0, j = str.length; i < j; i++) {
        var newStr = str.substring(0, i + 1);
        if (newStr.length == 1) {
            partMatch[i] = 0;
        } else {
            for (var k = 0; k < i; k++) {
                //前缀
                prefix[k] = newStr.slice(0, k + 1);
                //后缀
                suffix[k] = newStr.slice(-k - 1);
                //如果相等就计算大小,并放入结果集中
                if (prefix[k] == suffix[k]) {
                    partMatch[i] = prefix[k].length;
                }
            }
            if (!partMatch[i]) {
                partMatch[i] = 0;
            }
        }
    }
    return partMatch;
}

const moveTable = (prefix) => {
    let rePrefix = [-1];
    prefix.forEach((p, index) => {
        if (index === prefix.length - 1) {
            return;
        }
        rePrefix.push(p)
    });

    return rePrefix;
}

match = (str, modalStr) => {
    let sl = str.length;
    let ml = modalStr.length;
    let prefix = moveTable(kmpGetStrPartMatchValue(modalStr));
    let i = 0, j = 0;
    while (i < sl) {
        console.log(i, str[i], j, modalStr[j])
        if (j === (ml - 1) && str[i] === modalStr[j]) {
            console.log(`在str下标为${i - j}开始到${i}处匹配成功`)
            break;
        }
        if (str[i] === modalStr[j]) {
            j++;
        } else {
            if (j === -1) {
                j++;
            }
            j = prefix[j];


        }
        i++;
    }
}

match('chrchewchcqchchis', 'chch')