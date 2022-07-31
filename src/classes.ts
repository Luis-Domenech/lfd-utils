import chalk from 'chalk'
import { name_to_pkg_name } from './functions.js'

export class Logger {
  disable_warnings: boolean
  name: string
  pkg_name: string

  tags: {
    error: string
    warn: string
    info: string
    query: string
  }

  constructor (name: string, disable_warnings = false) {
    this.disable_warnings = disable_warnings
    this.pkg_name = name_to_pkg_name(name)

    this.tags = {
      error: chalk.red(`${this.pkg_name}:error`),
      warn: chalk.yellow(`${this.pkg_name}:warn`),
      info: chalk.cyan(`${this.pkg_name}:info`),
      query: chalk.blue(`${this.pkg_name}:query`),
    }
  }

  log = (...data: any[]) => console.log(...data)
  
  warn = (message: any, ...optionalParams: any[]) => {if (!this.disable_warnings) console.warn(`${this.tags.warn} ${this.name}: ${message}`, ...optionalParams)}
  
  info = (message: any, ...optionalParams: any[]) => console.info(`${this.tags.info} ${this.name}: ${message}`, ...optionalParams)
  
  error = (message: any, ...optionalParams: any[]) => {console.error(`${this.tags.error} ${this.name}: ${message}`, ...optionalParams); process.exit(1)}
  
  query = (message: any, ...optionalParams: any[]) => console.log(`${this.tags.query} ${this.name}: ${message}`, ...optionalParams)  

  logger = { query: this.query, error: this.error, info: this.info, warn: this.warn, log: this.log }
}