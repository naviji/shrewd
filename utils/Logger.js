export const LogLevel = {
    None : 0,
    Error : 10,
    Warn : 20,
    Info : 30,
    Debug : 40,
}

class Logger {
    constructor (level = LogLevel.Debug) {
        this.logLevel = level
    }

    setLevel (level) {
        this.logLevel = level
    }

    _log (level, prefix, str) {
        if (this.logLevel < level) return;
        if (prefix !== '')
            process.stdout.write(`[${prefix}] `);
        console.log(str)
        // for (let msg of rest) {
        //     if (typeof msg === 'string') {
        //         process.stdout.write(` ${msg} `);
        //     } else {
        //         process.stdout.write(` ${JSON.stringify(msg)} `)
        //     }
        // }
        // process.stdout.write(`\n`);
        
    } 

    log (str) {
        this._log(this.logLevel, "", str)
    }

    debug (...rest) {
        this._log(LogLevel.Debug, "Debug", ...rest)
    }

    info (...rest) {
        this._log(LogLevel.Info, "Info", ...rest)
    }

    warn (...rest) {
        this._log(LogLevel.Warn, "Warn", ...rest)
    }

    error (...rest) {
        this._log(LogLevel.Error, "Error", ...rest)
    }
}

export default Logger