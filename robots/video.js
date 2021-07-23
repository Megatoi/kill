const jimp = require('jimp')
const state = require('./loader.js')

async function robot() {
    const content = await state.load()
    for (var indexSetence = 0; indexSetence < content.senteces.length; indexSetence++) {
        await convertImage(indexSetence)
    }
    async function convertImage(image) {
      const input = `./robots/imagens/${indexSetence}-original.png`
      const output = `./robots/imagens/${indexSetence}-converted.png`
      const width = 1920
      const height = 1080
      return new Promise((resolve, reject) => {
        jimp.read(input, (err, done) => {
         if(err) { throw err }
        resolve(done.resize(width, height).write(output))
      })
    })
  }
}    
module.exports = robot