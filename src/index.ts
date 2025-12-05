export default stringify

export type JSONPrimitive = string|number|boolean|null;

/**
 * @param {unknown} value
 * @returns {string}
 */
export function stringify (value:unknown) {
    const type = typeof value

    switch (type) {
        case 'undefined':
        case 'symbol':
            return serializeUndefined()
        case 'boolean':
            return serializeBoolean(value as boolean)
        case 'number':
            return serializeNumber(value as number)
        case 'string':
            return serializeString(value as string)
        case 'function':
            return serializeFunction(value as ((...args:any[])=>any))
        case 'object':
            break
        default:
            return JSON.stringify(value)
    }

    if (value === null) {
        return JSON.stringify(value)
    }

    if (typeof (value as any).toJSON === 'function') {
        return stringify((value as any).toJSON())
    }

    if (Array.isArray(value)) {
        return serializeArray(value)
    }

    return serializeObject(value as Record<string, unknown>)
}

function serializeUndefined () {
    return 'null'
}

function serializeBoolean (bool:boolean):string {
    if (bool) return 'true'
    else return 'false'
}

function serializeNumber (num:number):string {
    if (isNaN(num)) {
        throw new Error('NaN is not allowed')
    }
    if (!isFinite(num)) {
        throw new Error('Infinity is not allowed')
    }
    return JSON.stringify(num)
}

// https://github.com/BridgeAR/safe-stable-stringify/blob/26dc000/index.js#L22-L33

// eslint-disable-next-line no-control-regex
const stringEscapeSequencesRegExp =
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u001f\u0022\u005c\ud800-\udfff]|[\ud800-\udbff](?![\udc00-\udfff])|(?:[^\ud800-\udbff]|^)[\udc00-\udfff]/

function serializeString (str:string):string {
    if (!isWellFormed(str)) {
        throw new Error(
            'Strings must be valid Unicode and not contain any surrogate pairs',
        )
    }
    if (str.length < 5000 && !stringEscapeSequencesRegExp.test(str)) {
        return '"' + str + '"'
    }
    return JSON.stringify(str)
}

function serializeFunction (fn:(...args:any[])=>any):string {
    return JSON.stringify(fn)
}

function serializeArray (arr:any[]):string {
    let str = '['
    const length = arr.length
    for (let i = 0; i < length; i++) {
        const val = arr[i]
        if (i !== 0) str += ','
        str += stringify(val)
    }
    return str + ']'
}

function serializeObject (obj: Record<string, unknown>):string {
    const sortedKeys = sort(Object.keys(obj))
    let str = '{'
    const length = sortedKeys.length
    for (let i = 0; i < length; i++) {
        const key = sortedKeys[i]
        const val = obj[key]
        if (val === undefined || typeof val === 'symbol') {
            continue
        }
        if (i !== 0 && str.length !== 0) {
            str += ','
        }
        str += stringify(key) + ':' + stringify(val)
    }
    return str + '}'
}

// https://github.com/BridgeAR/safe-stable-stringify/blob/26dc000/index.js#L35-L51
function sort (array:any[]) {
    // Insertion sort is very efficient for small input sizes but it has a bad
    // worst case complexity. Thus, use native array sort for bigger values.
    if (array.length > 2e2) {
        return array.sort()
    }
    for (let i = 1; i < array.length; i++) {
        const currentValue = array[i]
        let position = i
        while (position !== 0 && array[position - 1] > currentValue) {
            array[position] = array[position - 1]
            position--
        }
        array[position] = currentValue
    }
    return array
}

const stringSurrogateRegex = /\p{Surrogate}/u

function isWellFormed (str:string):boolean {
    if (typeof String.prototype.isWellFormed === 'function') {
        return str.isWellFormed()
    }

    return !stringSurrogateRegex.test(str)
}
