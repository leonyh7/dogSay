import queryString from 'query-string'
import _ from 'lodash'
import Mock from 'mockjs'

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
    var options = _.extend(config.header, {
        body: Json.stringify(body)
    })
    return fetch(url, options)
        .then((response) => response.json())
        .then((response) => Mock.mock(response))
}

module.exports = request
