const log = console.log.bind(console, '[+]')
const error = console.error.bind(console, '[!ERROR]')
const warn = console.warn.bind(console, '[!WARNING]')

module.exports = { log, warn, error }
