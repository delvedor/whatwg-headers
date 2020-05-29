'use strict'

const invalidCharHeaderName = /[^`\-\w!#$%&'*+.|~]/i
const invalidChatHeaderValue = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/i // eslint-disable-line
const kHeaders = Symbol('whatwg-headers')

class Headers {
  constructor () {
    this[kHeaders] = Object.create(null)
  }

  set (name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    this[kHeaders][name] = value
  }

  get (name) {
    return this[kHeaders][normalizeName(name)] || null
  }

  append (name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    const oldValue = this[kHeaders][name]
    this[kHeaders][name] = oldValue === undefined ? value : `${oldValue}, ${value}`
  }

  delete (name) {
    name = normalizeName(name)
    delete this[kHeaders][name]
  }

  entries () {
    const keys = Object.keys(this[kHeaders])
    const length = keys.length
    let index = -1
    const iterator = {
      next () {
        index += 1
        if (index >= length) {
          return { done: true, value: undefined }
        }
        const key = keys[index]
        return { done: false, value: [key, this[kHeaders][key]] }
      }
    }

    return iterator
  }

  [Symbol.iterator] () {
    return this[kHeaders].entries()
  }

  forEach (callback, thisArg) {
    for (const name in this[kHeaders]) {
      callback(this[kHeaders][name], name, thisArg)
    }
  }

  has (name) {
    name = normalizeName(name)
    return !!this[kHeaders][name]
  }

  keys () {
    const keys = Object.keys(this[kHeaders])
    const length = keys.length
    let index = -1
    const iterator = {
      next () {
        index += 1
        if (index >= length) {
          return { done: true, value: undefined }
        }
        return { done: false, value: keys[index] }
      }
    }

    return iterator
  }

  values () {
    const keys = Object.keys(this[kHeaders])
    const length = keys.length
    let index = -1
    const iterator = {
      next () {
        index += 1
        if (index >= length) {
          return { done: true, value: undefined }
        }
        return { done: false, value: this[kHeaders][keys[index]] }
      }
    }

    return iterator
  }
}

function normalizeName (name) {
  name = '' + name
  if (invalidCharHeaderName.test(name)) {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase().trim()
}

function normalizeValue (value) {
  value = '' + value
  if (invalidChatHeaderValue.test(value)) {
    throw new TypeError('Invalid character in header field value')
  }
  return value.trim()
}

module.exports = Headers
