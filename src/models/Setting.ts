import BaseModel from "./BaseModel"
// import Transaction from "./Transaction"

class Setting extends BaseModel {
    static tableName = () => "setting"

    static set = (key: string, value: string) => {
        const o = { key, value}
        const prev =  Setting.getByAttrWithValue('key', key);
        if (prev) {
            Setting.save(Object.assign({}, prev, o))
        }
        Setting.save(o)
    }

    static get = (key: string) => {
        const result = Setting.getByAttrWithValue('key', key);
        if (result.length) return result[0]
        return null
    }

}

export default Setting