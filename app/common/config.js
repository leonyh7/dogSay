var config = {
    host: 'http://rapapi.org/mockjs/20782',
    api: {
        creations: '/api/getCreations',
        up: '/api/up'
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