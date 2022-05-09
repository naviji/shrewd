import dayjs from 'dayjs'
const { sprintf } = require('sprintf-js')

export enum TargetType {
    Console = 'console'
}

export enum LogLevel {
    None = 0,
    Error = 10,
    Warn = 20,
    Info = 30,
    Debug = 40,
}

interface TargetOptions {
    level?: LogLevel;
    console?: any;
    prefix?: string;
    path?: string;
    source?: string;

    // Default message format
    format?: string;

    // If specified, will use this as format if it's an info message
    customInfoFormat?: string;
}

interface Target extends TargetOptions {
    type: TargetType;
}

export interface LoggerWrapper {
    debug: Function;
    info: Function;
    warn: Function;
    error: Function;
}

class Logger {
    private targets_: Target[] = [];
    private level_: LogLevel = LogLevel.Info;
    private enabled: boolean = true;

    constructor (level = LogLevel.Info) {
      this.level_ = level
    }

    public setLevel (level: LogLevel) {
      const previous = this.level
      this.level_ = level
      return previous
    }

    public level () {
      return this.level_
    }

    public targets () {
      return this.targets_
    }

    public addTarget (type: TargetType, options: TargetOptions | null = null) {
      const target = { type: type, ...options }
      this.targets_.push(target)
    }

    objectToString (object: any) {
      let output = ''

      if (typeof object === 'object') {
        if (object instanceof Error) {
          object = object as any
          output = object.toString()
          if (object.code) output += `\nCode: ${object.code}`
          if (object.headers) output += `\nHeader: ${JSON.stringify(object.headers)}`
          if (object.request) output += `\nRequest: ${object.request.substr ? object.request.substr(0, 1024) : ''}`
          if (object.stack) output += `\n${object.stack}`
        } else {
          output = JSON.stringify(object)
        }
      } else {
        output = object
      }

      return output
    }

    objectsToString (...object: any[]) {
      const output = []
      for (let i = 0; i < object.length; i++) {
        output.push(`"${this.objectToString(object[i])}"`)
      }
      return output.join(', ')
    }

    targetLevel (target: Target) {
      if ('level' in target) return target.level
      return this.level()
    }

    private log (level: LogLevel, prefix: string, ...object: any[]) {
      if (!this.targets_.length || !this.enabled) return

      for (let i = 0; i < this.targets_.length; i++) {
        const target = this.targets_[i]
        const targetPrefix = prefix || target.prefix
        const targetLevel = this.targetLevel(target)
        if (targetLevel && targetLevel < level) continue

        if (target.type === 'console') {
          let fn = 'log'
          if (level === LogLevel.Error) fn = 'error'
          if (level === LogLevel.Warn) fn = 'warn'
          if (level === LogLevel.Info) fn = 'info'
          const consoleObj = target.console ? target.console : console
          let items: any[] = []

          if (target.format) {
            const format = level === LogLevel.Info && target.customInfoFormat ? target.customInfoFormat : target.format

            const s = sprintf(format, {
              date_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              level: Logger.levelIdToString(level),
              prefix: targetPrefix || '',
              message: ''
            })

            items = [s.trim()].concat(...object)
          } else {
            const prefixItems = [dayjs().format('HH:mm:ss')]
            if (targetPrefix) prefixItems.push(targetPrefix)
            items = [`${prefixItems.join(': ')}:`].concat(...object)
          }

          consoleObj[fn](...items)
        }
      }
    }

    error (...object: any[]) {
      return this.log(LogLevel.Error, '', ...object)
    }

    warn (...object: any[]) {
      return this.log(LogLevel.Warn, '', ...object)
    }

    info (...object: any[]) {
      return this.log(LogLevel.Info, '', ...object)
    }

    debug (...object: any[]) {
      return this.log(LogLevel.Debug, '', ...object)
    }

    // private static levelStringToId (s: string) {
    //   if (s === 'none') return LogLevel.None
    //   if (s === 'error') return LogLevel.Error
    //   if (s === 'warn') return LogLevel.Warn
    //   if (s === 'info') return LogLevel.Info
    //   if (s === 'debug') return LogLevel.Debug
    //   throw new Error(`Unknown log level: ${s}`)
    // }

    static levelIdToString (id: LogLevel) {
      if (id === LogLevel.None) return 'none'
      if (id === LogLevel.Error) return 'error'
      if (id === LogLevel.Warn) return 'warn'
      if (id === LogLevel.Info) return 'info'
      if (id === LogLevel.Debug) return 'debug'
      throw new Error(`Unknown level ID: ${id}`)
    }

    static levelIds () {
      return [LogLevel.None, LogLevel.Error, LogLevel.Warn, LogLevel.Info, LogLevel.Debug]
    }
}

export default Logger
