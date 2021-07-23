const robots = {
    texto: require('./robots/texto.js'),
    input: require('./robots/input.js'),
    archiveSave: require('./robots/loader.js'),
    images: require('./robots/image.js'),
    video: require('./robots/video.js')
}

async function comecar() {
    robots.input()

    await robots.texto()
    console.log('Injetando o link das imagens correspondentes ao tema')
    await robots.images()
    // await robots.video()
}

comecar()