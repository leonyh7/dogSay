var config = {
    host: 'http://rapapi.org/mockjs/20782',
    api: {
        creations: '/api/creations',
        up: '/api/up',
        comment: '/api/comments'
    },
    header: {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Contenr-Type': 'applicaton/json'
        }
    }
}

module.exports = config