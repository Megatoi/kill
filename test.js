const ora = require('ora')
const chalk = require('chalk')

//let spinner = ora(`Carregando midia`).start()

setTimeout(() => {
    ora('Conteudo carregado').succeed('Boa pra nois')
    // spinner.color = 'red'
    // spinner.text = 'Falha'
}, 3000)