const readLine = require('readline-sync')
const robots = {
    texto: require('./robots/texto.js')
}
async function comecar() {

    const content = {}
    content.tema = escutar_termo()
    content.prefixo = escutar_prefixo()
    await robots.texto(content)

    function escutar_termo() {
         return readLine.question('Qual termo voce deseja procurar em WIkiPedia? ')
     }

    
    function escutar_prefixo() {
        let prefixes = ['Who is', 'What is', 'The history off']
        let indice_do_prefico = readLine.keyInSelect(prefixes)
        let texto_guardado_no_indice = prefixes[indice_do_prefico]

        return texto_guardado_no_indice
     }
    
   
}

comecar()