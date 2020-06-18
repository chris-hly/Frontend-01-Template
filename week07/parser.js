const EFO = Symbol('EFO');
const css = require('css')
let currentToken = null; // 记录当前的tag
let currentAttribute = null; // 记录当前的属性
let currentTextNode = null; // 记录当前的text
let stack = [{ type: "document", children: [] }];// dom树
let rules = []// css树

function specificity(selector) {
    let p = [0, 0, 0, 0]
    let selectorParts = selector.split(" ")
    for (let part of selectorParts) {
        if (part.charAt(0) === '#') {
            p[1] += 1;
        } else if (part.charAt(0) === '.') {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0]
    }
    if (sp1[1] - sp1[1]) {
        return sp1[1] - sp2[1]
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2]
    }
    return sp1[3] - sp2[3]
}

function addCssRules(text) {
    let ast = css.parse(text)
    rules.push(...ast.stylesheet.rules)
}

function computeCss(element) {
    let elements = stack.slice().reverse();
    if (!element.computedStyle)
        element.computedStyle = {}
    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(' ').reverse();
        if (!match(element, selectorParts[0])) {
            continue;
        }
        let matched = false;
        let j = 1;

        for (let i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j - 1])) {
                j++
            }
        }

        if (j > selectorParts.length) {
            matched = true
        }

        if (matched) {
            let sp = specificity(rule.selectors[0])
            let computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {}
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity =  sp;
                }else if(compare(computedStyle[declaration.property].specificity, sp) > 0){
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity =  sp;
                }
            }
        }
    }

}

function match(element, selector) {
    if (!selector || !element.attributes) {
        return false
    }
    if (selector.charAt(0) == '#') {
        let attr = element.attributes.filter(item => item.name === 'id')[0];
        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if (selector.charAt(0) == '.') {
        let attr = element.attributes.filter(item => item.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', '')) {
            return true;
        }
    } else {
        if (element.tagName == selector) {
            return true;
        }
    }
    return false
}

function emit(token) {
    let top = stack[stack.length - 1]
    if (token.type === "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        }
        element.tagName = token.tagName;
        for (let p in token) {
            if (p != 'type' && p != 'tagName') {
                element.attributes.push({ name: p, value: token[p] })
            }
        }
        top.children.push(element);
        element.parant = top;
        if (!token.isSelfClosing) {
            stack.push(element)
        }
        currentTextNode = null;
        computeCss(element)
    } else if (token.type === "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error('tag start is not match');
        } else {
            if (top.tagName == 'style') {
                addCssRules(top.children[0].content)
            }
            stack.pop();
        }
        currentTextNode = null
    } else if (token.type == 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

function data(c) {
    if (c == '<') {
        return tagOpen;
    } else if (c == EFO) {
        emit({ type: 'EFO' })
        return;
    } else {
        emit({ type: 'text', content: c })
        return data;
    }
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c);
    } else {
        emit({
            type: 'text',
            content: c
        })
        return;
    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforAttributeName
    } else if (c == '/') {
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c;
        return tagName
    } else if (c == '>') {
        emit(currentToken)
        return data
    } else {
        currentToken.tagName += c;
        return tagName
    }
}

function beforAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforAttributeName
    } else if (c == '/' || c == '>' || c == EFO) {
        return afterAttributeName(c)
    } else if (c == '=') {

    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c);
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == "=") {
        return beforAttributeValue;

    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken)
        return data;
    } else if (c == EFO) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }

}

function attributeName(c) {
    if (c.match(/^[\t\n\f ]$/) || c == '/' || c == EFO || c == '>') {
        return afterAttributeName(c)
    } else if (c == '=') {
        return beforAttributeValue
    } else if (c == '\u0000') {
        return attributeName;

    } else if (c == "\"" || c == "'" || c == "<") {
        return attributeName;

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EFO) {
        return beforAttributeValue;
    } else if (c == "\"") {
        return doubleQuotedAttributeValue;
    } else if (c == "\'") {
        return singleQuotedAttributeValue;
    } else if (c == ">") {

    } else {
        return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == EFO) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == EFO) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken)
        return data
    } else if (c == EFO) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforAttributeName;
    } else if (c == '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data
    } else if (c == '\u0000') {

    } else if (c == "\"" || c == "\'" || c == "<" || c == "=" || c == "`") {

    } else if (c == EFO) {

    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }

}

function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken)
        return data;
    } else if (c == EFO) {

    } else {

    }
}


function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c == '>') {

    } else if (c == EFO) {

    } else {

    }
}


module.exports.parserHTML = (html) => {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EFO)
    recursion(stack[0])
    return stack[0]

}

function recursion(dom) {
    if (dom.computedStyle) {
        console.log(dom.tagName,dom.computedStyle)
    }
    if (dom.children && dom.children[0]) {
        for (let a of dom.children) {
            recursion(a)
        }
    }
}
