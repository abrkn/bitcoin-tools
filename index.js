var ursa = require('ursa')
, BitcoinLib = require('bitcoinjs-lib')

/**
 * Creates a random Bitcoin private key
 * @return {string} Private key encoded with base58
 */
exports.createPrivateKey = function() {
    return new BitcoinLib.Key()['export']('base58')
}

/**
 * Extracts address (public key) from Bitcoin private key
 * @param  {string} privKey Private key encoded with Base58
 * @return {string}         Bitcoin address encoded with Base58
 */
exports.addressFromPrivateKey = function(privKey) {
    return new BitcoinLib.Key(privKey).getBitcoinAddress('base58').toString()
}

/**
 * Encrypts the specified Bitcoin private key using an RSA public key
 * @param  {Buffer} rsaPub         RSA public key as Buffer
 * @param  {string} privKeyBase58  Bitcoin private key encoded with Base58
 * @return {string}                RSA-encrypted Bitcoin private key encoded with Base64
 */
exports.encryptPrivateKey = function(rsaPub, privKeyBase58) {
    if (!privKeyBase58.match(/^5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50}/)) {
        throw new Error(privKeyBase58 + ' is not valid Bitoin base58 encoded private key')
    }

    var privKey = new BitcoinLib.Key(privKeyBase58)
    , privKeyBuf = new Buffer(privKey['export']('bytes'))
    , rsaPubUrsa = ursa.createPublicKey(rsaPub)

    var crypted = rsaPubUrsa.encrypt(privKeyBuf)

    return crypted.toString('base64')
}

/**
 * Decrypts an RSA-encrypted Bitoin private key
 * @param  {string} rsaPriv          RSA private key as Buffer
 * @param  {string} privKeyCrypted   Encrypted Bitcoin private key encoded with Base64
 * @return {string}                  Bitcoin private key encoded with Base58
 */
exports.decryptPrivateKey = function(rsaPriv, privKeyCrypted) {
    var rsaPrivUrsa = ursa.createPrivateKey(rsaPriv)
    , cryptedBuf = new Buffer(privKeyCrypted, 'base64')
    , decryptedBuf = rsaPrivUrsa.decrypt(cryptedBuf)

    // ECKey works with arrays, not buffers
    var decryptedArr = Array.prototype.slice.call(decryptedBuf, 0)
    , decrypted = new BitcoinLib.Key(decryptedArr)

    return decrypted['export']('base58')
}
