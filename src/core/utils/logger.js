const chalk = require('chalk');
const levels ={
    info:chalk.blue,
    success:chalk.green,
    warning:chalk.yellow,
    error:chalk.red
};

const logger ={
    info: (message) => console.log(levels.info(message)),
    success: (message) => console.log(levels.success(message)),
    warning: (message) => console.log(levels.warning(message)),
    error: (message) => console.log(levels.error(message))
};

module.exports = logger;