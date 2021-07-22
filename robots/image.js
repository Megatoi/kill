const image_search = require('g-i-s')
const state = require('./loader.js')
async function search(query) {
    
    const content = state.load()
    await injetarLinkImages()
    state.save(content)
    async function injetarLinkImages() {
        let tema = content.tema
        for(const setece of content.senteces) {
            const query = `${tema} ${setece.keyworld[0]}`
            setece.images = await buscarImagens(query)
            
        }
     }

    // console.dir(content, { depth: null })

    async function buscarImagens(query){
        return new Promise((resolve, reject) => { image_search(query, (err,data) => { 
            data.map((data) => { 
                    resolve(data.url)
            })
        })
     })
     }
    
   
}

module.exports = search 