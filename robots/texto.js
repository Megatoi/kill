const algorithmia = require('algorithmia');

function robot(content) {
    baixarConteudoWikipedia(content)

    function baixarConteudoWikipedia(content) {
        const algorithimiaAutentic = algorithmia('simz97f9QN54+vuZZrq+iNKQudn1')
        const wikipediaAlgorithn = algorithimiaAutentic.algo('')
        const wikipediaResponse = wikipediaAlgorithn.pipe(content.tema)
        const conteudo = wikipediaResponse.get()
        console.log(conteudo)
    }
}

module.exports = robot