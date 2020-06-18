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
    let elementStyle = getStyle(element);

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

    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch'
    }

    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start'
    }

    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap'
    }

    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch'
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, corssStart, corssEnd, corssSign, corssBase;

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;
        crossSize = 'height';
        corssStart = 'top';
        corssEnd = 'bottom'
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;
        crossSize = 'width';
        corssStart = 'left';
        corssEnd = 'right'
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = 0;
        crossSize = 'height';
        corssStart = 'top';
        corssEnd = 'bottom'
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
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
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
               crossSpace = Math.max(crossSpace, itemStyle[crossSize])
            }
            flexLine.push(item)
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item)
            }

            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize]
        }
    }

    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== void 0) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
            currentMain = itemStyle[mainEnd]
        }
    } else {
        flexLines.forEach(items => {
            var mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                let itemStyle = getStyle(item);
                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                // flex items
                let currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    let item = items[0];
                    let itemStyle = getStyle(item);
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                //justifyContent
                let currentMain = mainBase;
                let step = 0;

                if (style.justifyContent === 'flex-start') {
                    let currentMain = mainBase;
                    let step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    let currentMain = mainSpace * mainSign + mainBase;
                    let step = 0
                }
                if (style.justifyContent === 'center') {
                    let currentMain = mainSpace / 2 * mainSign + mainBase;
                    let step = 0;
                }
                if (style.justifyContent === 'space-between') {
                    let currentMain = mainBase;
                    let step = mainSpace / (items.length - 1) * mainSign;
                }
                if (style.justifyContent === 'space-around') {
                    let step = mainSpace / items.length * mainSign;
                    let currentMain = step / 2 + mainBase;
                }

                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item)
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step
                }
            }
        })
    }

    // corss axis align-item  align-self
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] += flexLines[i].crossSpace
        }
    } else {
        crossSpace = style[crossSize]
        for (var i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSpace
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        corssBase = style[crossSize];
    } else {
        corssBase = 0;
    }
    let lineSize = style[crossSize] / flexLines.length;
    let step;
    if (style.alignContent === 'flex-start') {
        corssBase += 0;
        step = 0;
    }
    if (style.alignContent === 'flex-end') {
        corssBase += corssSign * crossSpace / 2
        step = 0;
    }
    if (style.alignContent === 'center') {
        corssBase += 0;
        step = crossSpace / (flexLines.length - 1)
    }
    if (style.alignContent === 'space-between') {
        corssBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        corssBase += corssSign * step / 2
    }
    if (style.alignContent === 'stretch') {
        corssBase += 0;
        step = 0;
    }

    flexLines.forEach(items => {
        let lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            item.crossSpace;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            let align = itemStyle.alignSelf || style.alignItems;
            if (itemStyle[crossSize] == null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0
            }
            if (align === 'flex-start') {
                itemStyle[corssStart] = corssBase;
                itemStyle[corssEnd] = itemStyle[corssStart] + corssSign * itemStyle[crossSize];
            }

            if (align === 'flex-end') {
                itemStyle[corssEnd] = corssBase + corssSign * lineCrossSize;
                itemStyle[corssStart] = itemStyle[corssEnd] - corssSign * itemStyle[crossSize];
            }
            if (align === 'center') {
                itemStyle[corssStart] = corssBase + corssSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[corssEnd] = itemStyle[corssStart] + corssSign * itemStyle[crossSize];
            }
            if (align === 'stretch') {
                itemStyle[corssStart] = corssBase;
                itemStyle[corssEnd] = corssBase + corssSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ?
                    itemStyle[crossSize] : lineCrossSize)
                itemStyle[crossSize] = corssSign * (itemStyle[corssEnd] - itemStyle[corssStart])
            }
        }
        corssBase += corssSign * (lineCrossSize + step);
    })
    // console.log(items)
}

module.exports = layout;