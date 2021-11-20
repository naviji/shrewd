// import time from './time';
// import Setting from './models/Setting';
// import Logger from './Logger';

import Setting from "../models/Setting";
import timeUtils from "../utils/timeUtils";
import Logger from "./Logger";

interface Task {
	id: string;
	callback: Function;
}

interface TaskResult {
	id: string;
	result: any;
	error?: Error;
}

export default class TaskQueue {

	private waitingTasks_: Task[] = [];
	private processingTasks_: Record<string, Task> = {};
	private processingQueue_ = false;
	private stopping_ = false;
	private results_: Record<string, TaskResult> = {};
	private name_: string;
	private logger_: Logger;

	constructor(name: string, logger: Logger = null) {
		this.name_ = name;
		this.logger_ = logger ? logger : new Logger();
	}

	concurrency() {
		return Setting.get('sync.maxConcurrentConnections') || 5;
	}

	push(id: string, callback: Function) {
		if (this.stopping_) throw new Error('Cannot push task when queue is stopping');

		this.waitingTasks_.push({
			id: id,
			callback: callback,
		});
		this.processQueue_();
	}

	processQueue_() {
		if (this.processingQueue_ || this.stopping_) return;

		this.processingQueue_ = true;

		const completeTask = (task: Task, result: any, error: Error) => {
			delete this.processingTasks_[task.id];

			const r: TaskResult = {
				id: task.id,
				result: result,
			};

			if (error) r.error = error;

			this.results_[task.id] = r;

			this.processQueue_();
		};

		while (this.waitingTasks_.length > 0 && Object.keys(this.processingTasks_).length < this.concurrency()) {
			if (this.stopping_) break;

			const task = this.waitingTasks_.splice(0, 1)[0];
			this.processingTasks_[task.id] = task;

			task
				.callback()
				.then((result: any) => {
					completeTask(task, result, null);
				})
				.catch((error: Error) => {
					if (!error) error = new Error('Unknown error');
					completeTask(task, null, error);
				});
		}

		this.processingQueue_ = false;
	}

	isWaiting(taskId: string) {
		return this.waitingTasks_.find(task => task.id === taskId);
	}

	isProcessing(taskId: string) {
		return taskId in this.processingTasks_;
	}

	isDone(taskId: string) {
		return taskId in this.results_;
	}

	async waitForAll() {
		return new Promise((resolve) => {
			const checkIID = setInterval(() => {
				if (this.waitingTasks_.length) return;
				if (this.processingTasks_.length) return;
				clearInterval(checkIID);
				resolve(null);
			}, 100);
		});
	}

	taskExists(taskId: string) {
		return this.isWaiting(taskId) || this.isProcessing(taskId) || this.isDone(taskId);
	}

	taskResult(taskId: string) {
		if (!this.taskExists(taskId)) throw new Error(`No such task: ${taskId}`);
		return this.results_[taskId];
	}

	async waitForResult(taskId: string) {
		if (!this.taskExists(taskId)) throw new Error(`No such task: ${taskId}`);

		while (true) {
			const task = this.results_[taskId];
			if (task) return task;
			await timeUtils.sleep(0.1);
		}
	}

	async stop() {
		this.stopping_ = true;

		this.logger_.info(`TaskQueue.stop: ${this.name_}: waiting for tasks to complete: ${Object.keys(this.processingTasks_).length}`);

		// In general it's not a big issue if some tasks are still running because
		// it won't call anything unexpected in caller code, since the caller has
		// to explicitely retrieve the results
		const startTime = Date.now();
		while (Object.keys(this.processingTasks_).length) {
			await timeUtils.sleep(0.1);
			if (Date.now() - startTime >= 30000) {
				this.logger_.warn(`TaskQueue.stop: ${this.name_}: timed out waiting for task to complete`);
				break;
			}
		}

		this.logger_.info(`TaskQueue.stop: ${this.name_}: Done, waited for ${Date.now() - startTime}`);
	}

	isStopping() {
		return this.stopping_;
	}
}
