/* global describe, it */
var expect = require('expect.js')
, bitcoinTools = require('../')
, fs = require('fs')
, path = require('path')
, privKey1 = fs.readFileSync(path.join(__dirname, 'key1.pem'))
, pubKey1 = fs.readFileSync(path.join(__dirname, 'key1.pub'))
, privKey2 = fs.readFileSync(path.join(__dirname, 'key2.pem'))
, pubKey2 = fs.readFileSync(path.join(__dirname, 'key2.pub'))

describe('bitcoin-tools', function() {
    describe('createPrivateKey', function() {
        it('creates valid looking private keys', function() {
            var privKey = bitcoinTools.createPrivateKey()
            expect(privKey).to.match(/^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}/)
        })
    })

    describe('encryptPrivateKey', function() {
        it('creates base64 looking output', function() {
            var privateKey = '5JGDyCbQrMDmFuf9YHQHTYaSzDvzdA8X6fzj2DAy6pcSLCuzDcB'
            , encryptedPrivateKey = bitcoinTools.encryptPrivateKey(pubKey1, privateKey)

            expect(encryptedPrivateKey).to.match(/^[a-zA-Z0-9+/]+=*$/)
        })
    })

    describe('decryptPrivateKey', function() {
        it('handles known crypted/decrypted pair', function() {
            var encrypted = 'IdoB678tiQTDA/nSZfbKUcWb+2tSF5rAhvUjl4sZjZfSe5rWYqYBWNnHWb/' +
                'JyXBu91pYbWIj+k2V1ZRGHLyQ6a4az/efg/VcuiyUzGHyAcSJCpf5vD7V2y69LPrFP8lyN4' +
                'haKWIMiqHdoQJ2d3I9VBQbmel4XqUj9Sbw4NzpE2ogyWHd+ewEf4OERCJJhv2lbw6wJqKzC' +
                '9KOsH1T96lqkUUAR26bvN6I38VaL/30idUT8034GZ7PVOK+fWj2CvVgE95Nlh3QsCV4BswR' +
                'Tt6kaKt9BmsNpIMUyUT/eoBu6MuyMz0VAPYpNiUme7ZNAtMB+4rYFvzLCIHWycZkw1Gr2g=='
            , privateKey = bitcoinTools.decryptPrivateKey(privKey1, encrypted)

            expect(privateKey).to.be('5KBPPx175petouTM2cVssqwLa6STC481udgjAFDYfi48YHr3oaa')
        })
    })

    describe('addressFromPrivateKey', function() {
        it('handles known example', function() {
            var privateKey = '5J6QAnFrvVz3ztYDB4BqF7aB4fQtbk5oe5VdWsGiNB6ncG41d1r'
            , expectedAddress = '14P4EUHbgN2yeLAgtzhpqS3ZuU8qatQfzm'
            , actualAddress = bitcoinTools.addressFromPrivateKey(privateKey)
            expect(actualAddress).to.be(expectedAddress)
        })
    })

    it('can do a roundtrip', function() {
        var privKey = bitcoinTools.createPrivateKey()
        , encryptedPrivateKey = bitcoinTools.encryptPrivateKey(pubKey2, privKey)
        , decryptedPrivateKey = bitcoinTools.decryptPrivateKey(privKey2, encryptedPrivateKey)
        expect(decryptedPrivateKey).to.be(privKey)
    })
})
