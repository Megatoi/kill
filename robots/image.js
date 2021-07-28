const image_search = require('g-i-s')
const state = require('./loader.js')
const image_download = require('image-downloader')
const ora = require('ora')
const chalk = require('chalk')


async function search(query) {
    
    const content = await state.load()
    await injetarLinkImages()
    state.save(content)
    await baixarTodasImagens(content)

    async function injetarLinkImages() {
        let tema = content.tema
        for(const setece of content.senteces) {
            const query = `${tema} ${setece.keyworld[0]}`
            let links = await buscarImagens(query)
            setece.images = links.slice(0, 3)
            console.log(`
            ${chalk.green(`texto: ${chalk.blue(`[ ${setece.text} ]` )}`)} 
            ${chalk.green(`keyworld: ${chalk.blue(`[ ${setece.keyworld}]` )}`)}
            ${chalk.green(`images: ${chalk.blue(`[ ${setece.images} ]` )}`)}
            `)
            await timer(1500)
        }
     }

    // console.dir(content, { depth: null })

    async function buscarImagens(query){
        return new Promise((resolve, reject) => { image_search(query, (err,data) => { 
            resolve(data.map((link) => { return link.url }))
        })
     })
     }
    
     async function baixarTodasImagens(content) {
          content.downloadedImages = []
          
          for ( let senteceIndex = 0; senteceIndex < content.senteces.length; senteceIndex++) {
              let image = content.senteces[senteceIndex].images
            
              for ( let imageIndex = 0; imageIndex < image.length; imageIndex++) {
                let imageurl = image[imageIndex]

                try {

                    if( content.downloadedImages.includes(imageurl)){
                        throw new Error('Erro essa imagem já foi baixada')
                    }

                    await downloadImage(imageurl, `${senteceIndex}-original.png`)
                    content.downloadedImages.push(imageurl)
                    ora().succeed(`[${senteceIndex}][${imageIndex}] > ${chalk.green(`Imagem baixada com sucesso: ${imageurl}`) }`)
                    break
                } catch (e) {
                    ora().fail(`[${senteceIndex}][${imageIndex}] ${chalk.red(`Erro ao baixar imagem ${imageurl} ${e}`)}`)
                }
              
              }
          }
        } 
       function downloadImage(url, destName) {
           return image_download.image({
               url: url,
               dest: `./robots/imagens/${destName}`
           })
       }

       async function timer(time) {
           return new Promise((resolve) => { setTimeout(resolve, time) })
       }
}

module.exports = search 