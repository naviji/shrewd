import Logger from "./Logger";

export default class BaseService {

	static logger_: Logger;
	protected instanceLogger_: Logger;

	logger(): Logger {
		if (this.instanceLogger_) return this.instanceLogger_;
		if (!BaseService.logger_) throw new Error('BaseService.logger_ not set!!');
		return BaseService.logger_;
	}

	setLogger(v: Logger) {
		this.instanceLogger_ = v;
	}
}
