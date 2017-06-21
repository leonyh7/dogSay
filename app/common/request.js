import queryString from 'query-string'
import Mock from 'mockjs'
var config = require('./config.js')

var request = {}

request.get = function (url, params) {
    if (params) {
        url += '?' + queryString.stringify(params)
    }
    return fetch(url)
        .then((response) => response.json())
        .then((response) => Mock.mock(response))
}

request.post = function (url, body) {
    var options = Object.assign({},config.header, {
        body: JSON.stringify(body)
    })
    return fetch(url, options)
        .then((response) => response.json())
        .then((response) => Mock.mock(response))
}

module.exports = request
