const robots = {
    texto: require('./robots/texto.js'),
    input: require('./robots/input.js'),
    archiveSave: require('./robots/loader.js')
}

async function comecar() {

    robots.input()

    await robots.texto()
   
}

comecar()