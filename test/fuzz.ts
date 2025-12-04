import { test } from '@substrate-system/tapzero'
import { join } from 'node:path'
import { readFileSync, readdirSync } from 'node:fs'
import jsonCanon from '../src/index.js'

const fuzziesDir = join(process.cwd(), 'test-data', 'fuzzies')

// Test pre-generated fuzzy test cases
readdirSync(fuzziesDir).forEach((name:string) => {
    test(`fuzzy: ${name}`, (t) => {
        const input = readJsonSync(join(fuzziesDir, name))

        // Just make sure it doesn't crash and produces valid output
        try {
            const result = jsonCanon(input)
            t.ok(typeof result === 'string', 'should produce a string')

            // Verify it's valid JSON by parsing it back
            const parsed = JSON.parse(result)
            t.ok(parsed !== undefined, 'should produce parseable JSON')
        } catch (err:any) {
            // Some inputs may legitimately throw (NaN, Infinity, surrogate pairs)
            const validErrors = [
                'NaN is not allowed',
                'Infinity is not allowed',
                'Strings must be valid Unicode and not contain any surrogate pairs'
            ]
            t.ok(
                validErrors.includes(err.message),
                `should throw a valid error, got: ${err.message}`
            )
        }
    })
})

function readJsonSync (path:string) {
    return JSON.parse(readFileSync(path, 'utf8'))
}
