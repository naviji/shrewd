import BaseModel from "./BaseModel"
// import Transaction from "./Transaction"

class Setting extends BaseModel {
    static tableName = () => "setting"

    private static constants_ = {
            env: 'Dev',
            isDemo: false,
            appName: 'joplin',
            appId: 'SET_ME', // Each app should set this identifier
            appType: 'SET_ME' as any, // 'cli' or 'mobile'
            resourceDirName: '',
            resourceDir: '',
            profileDir: '',
            tempDir: '',
            pluginDataDir: '',
            cacheDir: '',
            pluginDir: '',
            flagOpenDevTools: false,
            syncVersion: 3,
            startupDevPlugins: [],
        };

    static set = (key: string, value: string) => {
        const o = { key, value}
        const prev =  Setting.getByAttrWithValue('key', key);
        if (prev) {
            Setting.save(Object.assign({}, prev, o))
        }
        Setting.save(o)
    }

    static setConstant = (key: string, value: string) => {
        this.constants_[key] = value
    }

    static get = (key: string) => {
        if (this.constants_[key]) return this.constants_[key]
        const result = Setting.getByAttrWithValue('key', key);
        if (result.length) return result[0]
        return null
    }

}

export default Setting