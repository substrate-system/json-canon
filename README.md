# `json-canon`

[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/json-canon/nodejs.yml?style=flat-square)](https://github.com/substrate-system/json-canon/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@substrate-system/json-canon?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/json-canon)](https://packagephobia.com/result?p=@substrate-system/json-canon)
[![gzip size](https://flat.badgen.net/bundlephobia/minzip/@substrate-system/json-canon)](https://bundlephobia.com/package/@substrate-system/json-canon)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)

Serialize JSON into a canonical format &mdash; safe for generating a consistent
cryptographic hash or signature.

Follows [RFC8785: JSON Canonicalization Scheme (JCS)](https://tools.ietf.org/html/rfc8785)

<details><summary><h2>Contents</h2></summary>
<!-- toc -->
</details>

![JSON cannon](./OdH7hw1.png)


## Fork

This is a fork of
[ahdinosaur/json-canon](https://github.com/ahdinosaur/json-canon).

## _Featuring_

The JSON Canonicalization Scheme concept in a nutshell:

* Serialization of primitive JSON data types using methods compatible with
  ECMAScript's `JSON.stringify()`
* Lexicographic sorting of JSON `Object` properties in a *recursive* process
* JSON `Array` data is also subject to canonicalization,
  *but element order remains untouched*


## References

- [`cyberphone/ietf-json-canon`](https://github.com/cyberphone/ietf-json-canon)
- [`cyberphone/json-canonicalization`](https://github.com/cyberphone/json-canonicalization)
