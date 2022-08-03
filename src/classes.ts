import chalk from 'chalk'
import { name_to_pkg_name } from './functions.js'

/**
 * Utility class 
 */
export class Logger {
  /**
   * Full name of package/module or whatever you want to associate with the logger
   */
  static full_pkg_name = "Logger"
  /**
   * This is auto set when instantiating class. It is the Logger's full_pkg_name, but in package format
   */
  static pkg_name = "logger"
  /**
   * Non async function that is called when Logger.error() is called. This can be set to some better functionn that handles program shutdown. As default, it is set to just execute process.exit(1)
   */
  static error_handler: (data?: any) => void = () => { process.exit(1) }
  /**
   * Async function that is called when Logger.error() is called. This can be set to some better functionn that handles program shutdown. As default, it is set to just execute process.exit(1)
   */
  static async_error_handler: (data?: any) => Promise<void> = async () => { process.exit(1) }
  /**
   * If set to true, Logger.warn() calls will not execute
   */
  static disable_warnings = false

  /**
   * These are used for invoking chalk
   */
  static tags = {
    error: chalk.red(`${Logger.pkg_name}:error`),
    warn: chalk.yellow(`${Logger.pkg_name}:warn`),
    info: chalk.cyan(`${Logger.pkg_name}:info`),
    query: chalk.blue(`${Logger.pkg_name}:query`),
  }

  constructor (name: string, disable_warnings: boolean, error_handler?: (data?: any) => void, async_error_handler?: (data?: any) => Promise<void>) {
    Logger.full_pkg_name = name
    Logger.pkg_name = name_to_pkg_name(name)
    Logger.disable_warnings = disable_warnings
    if (error_handler) Logger.error_handler = error_handler 
    if (async_error_handler) Logger.async_error_handler = async_error_handler 
  }

  static log = (...data: any[]) => console.log(...data)
  
  static warn = (message: any, ...optionalParams: any[]) => {if (!Logger.disable_warnings) console.warn(`${Logger.tags.warn} ${Logger.name}: ${message}`, ...optionalParams)}
  
  static info = (message: any, ...optionalParams: any[]) => console.info(`${Logger.tags.info} ${Logger.name}: ${message}`, ...optionalParams)
  
  static error = (message: any, data: any = null, ...optionalParams: any[]) => {console.error(`${Logger.tags.error} ${Logger.name}: ${message}`, ...optionalParams); Logger.error_handler(data)}
  
  static async_error = async (message: any, data: any = null, ...optionalParams: any[]) => {console.error(`${Logger.tags.error} ${Logger.name}: ${message}`, ...optionalParams); await Logger.async_error_handler(data)}
  
  static query = (message: any, ...optionalParams: any[]) => console.log(`${Logger.tags.query} ${Logger.name}: ${message}`, ...optionalParams)
}