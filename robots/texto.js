const algorithmia = require('algorithmia')
const apiKey_wattson = require('../credenciais/wattson.json')
const naturalLAnguageUnderstanding = require('watson-developer-cloud/natural-language-understanding/v1.js')
const apiKey = require('../credenciais/algorithmia.json').apiKey
const sentecesDetect = require('sbd')
const state = require('./loader.js')
const ora = require('ora')
const chalk = require('chalk')



var nlu = new naturalLAnguageUnderstanding({
    iam_apikey: apiKey_wattson.apikey,
    version: '2018-04-05',
    url: apiKey_wattson.url
})

const robot = async () => {

    
   const content = await state.load()
   console.clear()
   ora().succeed('Conteudo carregado')

   var spin1 = ora('Baixando conteudo pela wikipedia').start()
   await baixarConteudoWikipedia(content)
   spin1.succeed('Conteudo baixado com sucesso') 

   var spin2 = ora('Lipando conteudo').start()
   content.sourceContentLimpo = await conteudoLimpo(content.sourceContentOriginal)
   await timer(2500)
   spin2.succeed('Conteudo limpo')

   var spin3 = ora('Separando texto coletado em setenças').start()
   await separarEmSetences(content)
   await timer(2500)
   spin3.succeed('Texto separado com sucesso')

   var spin4 = ora('Pegando as primeiras ' + content.numeroMAximoSetensas + ' setenças').start()
   await pegarMAximoDesetences()
   await timer(2500)
   spin4.succeed('Setenças coletadas')

   var spin5 = ora('Injetando palavras chaves coletadas do texto').start()
   await injetarKeywords(content)
   await timer(2500)
   spin5.succeed('Keywords injetadas')

   var spin6 = ora('Salvando alterações...').start()
   state.save(content)
   await timer(4000)
   spin6.succeed('Salvo!')



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

    async function timer(time) {
        return new Promise((resolve, reject) => { setTimeout(resolve, time) }) 
    }
}

module.exports = robot 