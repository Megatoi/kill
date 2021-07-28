const gm = require('gm').subClass({ imageMagick: true });
const state = require('./loader.js')
const chalk = require('chalk')

async function robot() {
  const content = await state.load()
  for (var indexSetence = 0; indexSetence < content.senteces.length; indexSetence++) {
        await convertImage(indexSetence)
        await criarTexto(indexSetence, content.senteces[indexSetence].text)
    }
  await criar_thumbnail_yt()

    async function convertImage(image) {
      return new Promise((resolve, reject) => {
        const input = `./robots/imagens/${indexSetence}-original.png`
        const output = `./robots/imagens/${indexSetence}-converted.png`
        const width = 1920
        const height = 1080

        gm()
        .in(input)
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-blur', '0x9')
          .out('-resize', `${width}x${height}^`)
        .out(')')
        .out('(')
          .out('-clone')
          .out('0')
          .out('-background', 'white')
          .out('-resize', `${width}x${height}`)
        .out(')')
        .out('-delete', '0')
        .out('-gravity', 'center')
        .out('-compose', 'over')
        .out('-composite')
        .out('-extent', `${width}x${height}`)
        .write(output, (error) => {
          if (error) {
            return reject(error)
          }

          console.log(`> [video-robot] Image converted: ${output}`)
          resolve()
        })
      })
  }

  async function criarTexto(index,texto){
    return new Promise((resolve, reject) => {
    const output = `./robots/imagens/${index}-text.png`

    const templateSettings = {
      0: {
        size: '1920x800',
        gravity: 'center'
      },
      1: {
        size: '1920x400',
        gravity: 'center'
      },
      2: {
        size: '1920x600',
        gravity: 'west'
      },
      3: {
        size: '1920x1000',
        gravity: 'center'
      },
      4: {
        size: '1920x600',
        gravity: 'west'
      },
      5: {
        size: '1920x400',
        gravity: 'center'
      },
      6: {
        size: '1920x700',
        gravity: 'center'
      },
    }

    gm()
    .out('-size', templateSettings[index].size)
    .out('-gravity', templateSettings[index].gravity)
    .out('-background', 'transparent')
    .out('-fill', 'white')
    .out('-kerning', '-1')
    .out(`caption: ${texto}`)
    .write(output, (err) => {
      if(err) reject(err);
      console.log(`> [ ${chalk.green(`${texto}`)} ] escrito em ${output}`)
      resolve()
    })
   })
  }

  async function criar_thumbnail_yt() {
    return new Promise((resolve, reject) => {
      gm()
      .in('./robots/imagens/0-converted.png')
      .write('./robots/imagens/youtube-thumbnail.jpg', (err) => {
        if(err) reject(err)
        console.log(`${chalk.yellow("> thumbnail para o ")} ${chalk.red('YouTube')} ${chalk.yellow(' Criada com sucesso')}`)
      })
    })
  }
}    
module.exports = robot