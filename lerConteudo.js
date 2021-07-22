const robots = {
    texto: require('./robots/texto.js'),
    input: require('./robots/input.js'),
    archiveSave: require('./robots/loader.js'),
    images: require('./robots/image.js')
}

async function comecar() {
    
    const content = await robots.archiveSave.load()
    // robots.input()

    // await robots.texto()
    await robots.images()
}

comecar()