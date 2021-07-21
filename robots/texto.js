const algorithmia = require('algorithmia')
const apiKey_wattson = require('../credenciais/wattson.json')
const naturalLAnguageUnderstanding = require('watson-developer-cloud/natural-language-understanding/v1.js')
const apiKey = require('../credenciais/algorithmia.json').apiKey
const sentecesDetect = require('sbd')
const state = require('./loader.js')

var nlu = new naturalLAnguageUnderstanding({
    iam_apikey: apiKey_wattson.apikey,
    version: '2018-04-05',
    url: apiKey_wattson.url
})

const robot = async () => {
   
   const content = await state.load()
   console.clear()
   console.log('Conteudo Carregado')

   await baixarConteudoWikipedia(content)
    console.log('Conteudo Baixado')

   content.sourceContentLimpo = await conteudoLimpo(content.sourceContentOriginal)
    console.log('Conteudo limpo')

   await separarEmSetences(content)
    console.log('Conteudo separado em setences')

   await pegarMAximoDesetences()
    console.log('Maximo de setences em' + content.numeroMAximoSetensas)

   await injetarKeywords(content)
    console.log('Keyword injetada')

   state.save(content)
    console.log('SUCCESSss')

    async function baixarConteudoWikipedia(content){
        const algorithimiaAutentic = algorithmia(apiKey)
        const wikipediaAlgorithn = algorithimiaAutentic.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponse = await wikipediaAlgorithn.pipe({
            "lang": content.lang,
            "articleName": content.tema
        })
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


   async function palaras_chaves(setences) {
    return new Promise((resolve, reject) => {
        nlu.analyze({
            text: setences,
            features: {
                "keywords": {}
            }
        }, (err, response) => {
            if(err) { throw err }
            const keywords = response.keywords.map((keyword) => {
              return keyword.text
            })
            return resolve(keywords)
        })
    }
 )}

    function pegarMAximoDesetences() {
        content.senteces = content.senteces.slice(0, content.numeroMAximoSetensas)
    }

    async function injetarKeywords(content) {
        for(const setence of content.senteces) {
            setence.keyworld = await palaras_chaves(setence.text)
        }
    }
    
}

module.exports = robot 