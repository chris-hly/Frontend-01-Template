// { 'background-color': { value: 'pink', specificity: [ 0, 1, 0, 2 ] },
//   width: { value: '100px', specificity: [ 0, 1, 0, 2 ] },
//   height: { value: '100px', specificity: [ 0, 1, 0, 2 ] } } -- computedStyle

function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }
    for (let prop in element.computedStyle) {
        let p = element.computedStyle[prop].value;
        element.style[prop] = element.computedStyle[prop].value

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }

        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
    }
    return element.style;
}

function layout(element) {

    if (!element.computedStyle) {
        return;
    }
    let elementStyle =  getStyle(element);

    if (elementStyle.display !== 'flex') {
        return;
    }

    let items = element.children.filter(e => e.type === 'element')

    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0)
    })

    let style = elementStyle;

    ["width", "height"].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null
        }
    })

    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row'
    }

    if (!style.alignItem || style.alignItem === 'auto') {
        style.alignItem = 'stretch'
    }

    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent === 'flex-start'
    }

    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap === 'nowap'
    }

    if (!style.alignContent || style.alignContent === 'auto') {
        style.flexWrap === 'start'
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, corssStart, corssEnd, corssSign, corssBase;

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSing = +1;
        mainBase = 0;
        crossSize = 'height';
        corssStart = 'top';
        corssEnd = 'bottom'
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSing = +1;
        mainBase = 0;
        crossSize = 'width';
        corssStart = 'left';
        corssEnd = 'right'
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSing = -1;
        mainBase = 0;
        crossSize = 'height';
        corssStart = 'top';
        corssEnd = 'bottom'
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSing = -1;
        mainBase = 0;
        crossSize = 'width';
        corssStart = 'left';
        corssEnd = 'right'
    }

    if (style.flexWrap === 'wrap-reverse') {
        let temp = corssStart;
        corssStart = corssEnd;
        corssEnd = temp;
        corssSign = -1;
    } else {
        corssBase = 0;
        corssSign = 1;
    }

    var isAutoMainSize = false;
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] += itemStyle[mainSize]
            }
        }
        isAutoMainSize = true;
    }

    let flexLine = [];
    let flexLines = [flexLine];
    let mainSpace = style[mainSize]
    let crossSpace = 0;
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            flexLine.push(item)
        } else if (style.flexWrap === 'nowWrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSpace])
            }
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) { 
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [];
                flexLines.push(flexLine);
                flexLine.push(item);
                mainSpace = style[mainSize];
                crossSize = 0;
            } else {
                flexLine.push(item)
            }

            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -=  itemStyle[mainSize]
        }
    }

    
    flexLine.mainSpace = mainSpace;  
    if(flex.flexWrap === 'nowWrap' || isAutoMainSize){
        flexLine.crossSpace = (style[crossSize] !== void 0) ? style[crossSize] : crossSpace;
    }else{
        flexLine.crossSpace = crossSpace;
    }

    // if(mainSpace < 0){
    //     let scale = style[mainSize] / (style[mainSize] - mainSpace);
    //     let currentMain = mainBase;
    //     for(let i =0; i< items.length; i++){
    //         let item = items[i];
    //         let itemStyle = getStyle(item)

    //     }

    // }
}

module.exports = layout;