const image_search = require('g-i-s')
const state = require('./loader.js')
const image_download = require('image-downloader')
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
            console.log(setece)
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
                    console.log(`[${senteceIndex}][${imageIndex}] > Imagem baixada com sucesso: ${imageurl}`)    
                    break
                } catch (e) {
                    console.log(`[${senteceIndex}][${imageIndex}] Erro ao baixar imagem ${imageurl} ${e}`)
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
}

module.exports = search 