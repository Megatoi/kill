const fs = require('fs')
const content_path = './content.json'

function save(content) {
    content = JSON.stringify(content)
    return fs.writeFileSync(content_path, content)
}

async function load(content) {
    try {
        content = fs.readFileSync(content_path, 'utf-8')
        return JSON.parse(content)
    } catch (err) { 
        console.log('Arquivo não encontrado')
        await timer(500)
        console.log('Criando um novo content.json...')
        fs.writeFileSync(content_path, '')
        await timer(2000)
        console.clear()
    }
}

function timer(time) {
    return new Promise((resolve) => { setTimeout(resolve,time) })
}

module.exports = { save, load }