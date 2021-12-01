
export enum ModelType {
	Account = 1,
	Category = 2,
	CategoryGroup = 3,
	Target = 4,
	Transaction = 5,
	Transfer = 6
}

class BaseModel {

    public static TYPE_ACCOUNT = ModelType.Account;
	public static TYPE_CATEGORY = ModelType.Category;
	public static TYPE_CATEGORY_GROUP = ModelType.CategoryGroup;
	public static TYPE_TARGET = ModelType.Target;
	public static TYPE_TRANSACTION = ModelType.Transaction;
	public static TYPE_TRANSFER = ModelType.Transfer;

    private static db_
    
    static tableName(): string {
        throw new Error("Needs to be overriden")
    }

    static fieldNames(): string[] {
        throw new Error("Needs to be overriden")
    }

    static setDb(db) {
        this.db_ = db
    }

    static db() {
        return this.db_
    }

    static logger() {
        return this.db().logger()
    }

    static save(o) {
        return this.db().save(this.tableName(), o)
    }

    static getById(id) {
        return this.db().getById(this.tableName(), id)
    }

    static getByAttrWithValue(attr, value) {
        return this.db().getAll(this.tableName()).filter(x => x[attr] === value)
    }

    static findByName(name) {
        const result = this.db().getAll(this.tableName()).filter(x => x['name'] === name)
        return result.length ? result[0] : null
    }

    static getByAttrMap(map) {
        const _checkValues = (x: string, map: any) => {
            Object.keys(map).forEach(k => x[k] === map[k])
        }
        return this.db().getAll(this.tableName()).filter(x => _checkValues(x, map))
    }

    static deleteByAttrMap(map) {
        const _checkValues = (x: string, map: any) => {
            Object.keys(map).forEach(k => x[k] === map[k])
        }
        const result = this.db().getAll(this.tableName()).filter(x => _checkValues(x, map))
        for (let x of result) {
            BaseModel.deleteById(x.id)
        }
    }


    static getAll() {
        return this.db().getAll(this.tableName())
    }

    static getByParentId(id) {
        return this.db().getByParentId(this.tableName(), id)
    }

    static delete(id) {
        return this.deleteById(id)
    }

    static deleteById(id) {
        return this.db().deleteById(this.tableName(), id)
    }

    static removeUnknownFields(model: any) {
		const newModel: any = {};
		for (const n in model) {
			if (!model.hasOwnProperty(n)) continue;
			if (!this.hasField(n) && n !== 'type_') continue;
			newModel[n] = model[n];
		}
		return newModel;
	}

    static hasField(name: string) {
		const fields = this.fieldNames();
		return fields.indexOf(name) >= 0;
	}

}

export default BaseModel
