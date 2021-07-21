const fs = require('fs')
const content_path = './content.json'

function save(content) {
    content = JSON.stringify(content)
    return fs.writeFileSync(content_path, content)
}

function load(content) {
    content = fs.readFileSync(content_path, 'utf-8')
    return JSON.parse(content)
}

module.exports = { save, load }