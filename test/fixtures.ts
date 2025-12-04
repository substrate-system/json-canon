import { test } from '@substrate-system/tapzero'
import { join } from 'node:path'
import { readFileSync, readdirSync } from 'node:fs'
import jsonCanon from '../src/index.js'

const testDataBaseDir = join(process.cwd(), 'test-data')
const testDataInputDir = join(testDataBaseDir, 'input')
const testDataOutputDir = join(testDataBaseDir, 'output')

readdirSync(testDataInputDir).forEach((name:string) => {
    test(name, (t) => {
        const input = readJsonSync(join(testDataInputDir, name))
        const expected = readFileSync(join(testDataOutputDir, name), 'utf8').trim()
        const actual = jsonCanon(input)
        t.equal(actual, expected, `${name} should match expected output`)
    })
})

function readJsonSync (path:string) {
    return JSON.parse(readFileSync(path, 'utf8'))
}
