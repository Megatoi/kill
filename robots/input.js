const readLine = require('readline-sync')
const saveState = require('./loader.js')

function robot() {
    
    const content = {
        numeroMAximoSetensas: 7
    }

    content.tema = readLine.question(' Qual termo voce deseja procurar em WIkiPedia? ')
    content.prefixo = escutar_prefixo(content)
    content.lang = escolher_idioma()
    
    saveState.save(content)

    function escutar_prefixo(content) {
            let prefixes = ['Who is', 'What is', 'The history off']
            let indice_do_prefico = readLine.keyInSelect(prefixes)
            let texto_guardado_no_indice = prefixes[indice_do_prefico]

            return texto_guardado_no_indice
        }
        
    function escolher_idioma() {
            let idiomas = ['pt', 'en']
            let indice_escolhido = readLine.keyInSelect(idiomas, ' Em qual idioma devo apresentar? ')
            let texto_guardado_no_indice2 = idiomas[indice_escolhido]

            return texto_guardado_no_indice2
        }

}
    module.exports = robot