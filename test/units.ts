import { test } from '@substrate-system/tapzero'
import jsonCanon from '../src/index.js'

test('empty array', (t) => {
    const input:any[] = []
    const expected = '[]'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'empty array should serialize to []')
})

test('one element array', (t) => {
    const input = [123]
    const expected = '[123]'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'single element array should serialize correctly')
})

test('multi element array', (t) => {
    const input = [123, 456, 'hello']
    const expected = '[123,456,"hello"]'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'multi element array should serialize correctly')
})

test('null and undefined values in array', (t) => {
    const input = [null, undefined, 'hello']
    const expected = '[null,null,"hello"]'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'null and undefined should both serialize as null')
})

test('NaN in array', (t) => {
    try {
        const input = [NaN]
        jsonCanon(input)
        t.fail('should throw error for NaN')
    } catch (error:any) {
        t.equal(error.message, 'NaN is not allowed', 'should throw NaN error')
    }
})

test('NaN in object', (t) => {
    try {
        const input = { key: NaN }
        jsonCanon(input)
        t.fail('should throw error for NaN')
    } catch (error:any) {
        t.equal(error.message, 'NaN is not allowed', 'should throw NaN error')
    }
})

test('NaN single value', (t) => {
    try {
        const input = NaN
        jsonCanon(input)
        t.fail('should throw error for NaN')
    } catch (error:any) {
        t.equal(error.message, 'NaN is not allowed', 'should throw NaN error')
    }
})

test('Infinity in array', (t) => {
    try {
        const input = [Infinity]
        jsonCanon(input)
        t.fail('should throw error for Infinity')
    } catch (error:any) {
        t.equal(error.message, 'Infinity is not allowed',
            'should throw Infinity error')
    }
})

test('Infinity in object', (t) => {
    try {
        const input = { key: Infinity }
        jsonCanon(input)
        t.fail('should throw error for Infinity')
    } catch (error:any) {
        t.equal(error.message, 'Infinity is not allowed',
            'should throw Infinity error')
    }
})

test('Infinity single value', (t) => {
    try {
        const input = -Infinity
        jsonCanon(input)
        t.fail('should throw error for Infinity')
    } catch (error:any) {
        t.equal(error.message, 'Infinity is not allowed',
            'should throw Infinity error')
    }
})

test('object in array', (t) => {
    const input = [{ b: 123, a: 'string' }]
    const expected = '[{"a":"string","b":123}]'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'object keys should be sorted alphabetically')
})

test('empty object', (t) => {
    const input = {}
    const expected = '{}'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'empty object should serialize to {}')
})

test('object with undefined value', (t) => {
    const input = { test: undefined }
    const expected = '{}'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'undefined values should be omitted from objects')
})

test('object with null value', (t) => {
    const input = { test: null }
    const expected = '{"test":null}'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'null values should be preserved in objects')
})

test('object with one property', (t) => {
    const input = { hello: 'world' }
    const expected = '{"hello":"world"}'
    const actual = jsonCanon(input)
    t.equal(actual, expected,
        'single property object should serialize correctly')
})

test('object with more than one property', (t) => {
    const input = { hello: 'world', number: 123 }
    const expected = '{"hello":"world","number":123}'
    const actual = jsonCanon(input)
    t.equal(actual, expected,
        'multi property object should serialize with sorted keys')
})

test('undefined', (t) => {
    const input = undefined
    const expected = 'null'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'undefined should serialize to null')
})

test('null', (t) => {
    const input = null
    const expected = 'null'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'null should serialize to null')
})

test('symbol', (t) => {
    const input = Symbol('hello world')
    const expected = 'null'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'symbol should serialize to null')
})

test('object with symbol value', (t) => {
    const input = { test: Symbol('hello world') }
    const expected = '{}'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'symbol values should be omitted from objects')
})

test('object with number key', (t) => {
    const input = { 42: 'foo' }
    const expected = '{"42":"foo"}'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'number keys should be converted to strings')
})

test('object with symbol key', (t) => {
    const input = { [Symbol('hello world')]: 'foo' }
    const expected = '{}'
    const actual = jsonCanon(input)
    t.equal(actual, expected, 'symbol keys should be omitted')
})

test('object with toJSON', (t) => {
    const input = {
        a: 123,
        b: 456,
        toJSON: function () {
            return {
                b: this.b,
                a: this.a,
            }
        },
    }
    const expected = '{"a":123,"b":456}'
    const actual = jsonCanon(input)
    t.equal(actual, expected,
        'toJSON method should be called and result canonicalized')
})

test('"lone surrogate" invalid Unicode data', (t) => {
    const input = { test: '\u{DEAD}' }
    try {
        jsonCanon(input)
        t.fail('should throw error for invalid Unicode')
    } catch (error:any) {
        t.equal(
            error.message,
            'Strings must be valid Unicode and not contain any surrogate pairs',
            'should throw surrogate pairs error'
        )
    }
})
