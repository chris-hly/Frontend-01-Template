const dataJson = new Promise((resolve, rejsect) => {
    const data = {
        nodes: [{
            "id": "realm",
            "label": "realm",
            "class": "c0",
            "x": '',
            "y": ''
        }],
        edges: []
    }

    const glableArray = ["eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Array", "Date", "RegExp", "Promise", "Proxy", "Map", "WeakMap", "Set", "WeakSet", "Function", "Boolean", "String", "Number", "Symbol", "Object", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "SharedArrayBuffer", "DataView", "Float32Array", "Float64Array", "Int8Array", "Int16Array", "Int32Array", "Uint8Array", "Uint16Array", "Uint32Array", "Uint8ClampedArray", "Atomics", "JSON", "Math", "Reflect"]

    let set = new Set()

    let queue = [];

    for (let p of glableArray) {
        queue.push({
            path: [p],
            object: this[p]
        })
    }


    while (queue.length) {
        const currrent = queue.shift();
    
        if (set.has(currrent.object)) {
            continue;
        }

        data.nodes.push({
            "id": currrent.path.join('.'),
            "label": currrent.label || currrent.path.join('.') ,
            "class": "c0",
            "x": '',
            "y": ''
        })

        data.edges.push({
            source: currrent.parent ? currrent.parent.join('.') : 'realm',
            target: currrent.path.join('.'),
            "x": '',
            "y": ''
        })

        console.log(data)

        set.add(currrent.object)

        for (let p of Object.getOwnPropertyNames(currrent.object)) {

            let property = Object.getOwnPropertyDescriptor(currrent.object, p)

            if (property.hasOwnProperty('value') &&
                (typeof property.value != null &&
                    (typeof property.value === 'object'  || typeof property.value === 'function')&&
                    property.value instanceof Object)) {
                queue.push({
                    parent: currrent.path,
                    path: currrent.path.concat([p]),
                    object: property.value,
                    label: p

                })
            }

            if (property.hasOwnProperty('get') && (typeof property.get === 'function')) {
                queue.push({
                    parent: currrent.path,
                    path: currrent.path.concat([p]),
                    object: property.get,
                    label: p
                })
            }
            if (property.hasOwnProperty('set') && (typeof property.set === 'function')) {
                queue.push({
                    parent: currrent.path,
                    path: currrent.path.concat([p]),
                    object: property.set,
                    label: p
                })
            }
        }
    }

    resolve(data)
})

