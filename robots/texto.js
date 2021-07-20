const algorithmia = require('algorithmia');
const apiKey = require('../credenciais/algorithmia.json').apiKey
const sentecesDetect = require('sbd')
const robot = async (content) => {
   await baixarConteudoWikipedia(content)
   content.sourceContentLimpo = conteudoLimpo(content.sourceContentOriginal)
   separarEmSetences(content)

    async function baixarConteudoWikipedia(content){
        const algorithimiaAutentic = algorithmia(apiKey)
        const wikipediaAlgorithn = algorithimiaAutentic.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithn.pipe(content.tema)
        const conteudo = wikipediaResponse.get()
        content.sourceContentOriginal = conteudo.content

    }

    function conteudoLimpo(content) {
        const retornoLimpo = limpar_linhas_em_branco_e_marcador(content)

        function limpar_linhas_em_branco_e_marcador(content) {
            var todaslinhas = content.split('\n')

            var removedor = todaslinhas.filter((line) => {
                if(line.trim().length === 0 || line.trim().startsWith('=')) {
                    return false
             }
                
                return true
            })
            
            return removedor.join(' ')
        }
      return retornoLimpo
    }

    function separarEmSetences(content) {
        content.senteces = []
        let separador = sentecesDetect.sentences(content.sourceContentLimpo)
        separador.forEach((setences) => {
            content.senteces.push({
                text: setences,
                keyworld: [],
                images: [],
          })
        })
    }
    
    console.log(content)
    
}

module.exports = robot 