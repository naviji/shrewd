// import { ModelType } from '../../BaseModel';
// import { FileApi, MultiPutItem } from '../../file-api';
// import Logger from '../../Logger';
// import BaseItem from '../../models/BaseItem';
// import { BaseItemEntity } from '../database/types';
import { MultiPutItem } from "./FileApi";

import BaseItem from "../models/BaseItem";

import FileApi from "./FileApi";
import { BaseItemEntity } from "./types";
import Logger from "./Logger";

const logger = new Logger()

export type ApiCallFunction = (fnName: string, ...args: any[])=> Promise<any>;

interface BatchItem extends MultiPutItem {
	localItemupdatedAt: number;
}

export default class ItemUploader {

	private api_: FileApi;
	private apiCall_: ApiCallFunction;
	private preUploadedItems_: Record<string, any> = {};
	private preUploadedItemupdatedAts_: Record<string, number> = {};
	private maxBatchSize_ = 1 * 1024 * 1024; // 1MB;

	public constructor(api: FileApi, apiCall: ApiCallFunction) {
		this.api_ = api;
		this.apiCall_ = apiCall;
	}

	public get maxBatchSize() {
		return this.maxBatchSize_;
	}

	public set maxBatchSize(v: number) {
		this.maxBatchSize_ = v;
	}

	public async serializeAndUploadItem(ItemClass: any, path: string, local: BaseItemEntity) {
		const content = await ItemClass.serializeForSync(local);
		await this.apiCall_('put', path, content);
	}

	public async preUploadItems(items: BaseItemEntity[]) {
		// if (!this.api_.supportsMultiPut) return;

		const itemsToUpload: BatchItem[] = [];

		for (const local of items) {

			const ItemClass = BaseItem.itemClass(local);
			itemsToUpload.push({
				name: BaseItem.systemPath(local),
				body: await ItemClass.serializeForSync(local),
				localItemupdatedAt: local.updatedAt,
			});
		}

		let batchSize = 0;
		let currentBatch: BatchItem[] = [];

		const uploadBatch = async (batch: BatchItem[]) => {
			for (const batchItem of batch) {
				this.preUploadedItemupdatedAts_[batchItem.name] = batchItem.localItemupdatedAt;
			}

			const response = await this.apiCall_('multiPut', batch);
			this.preUploadedItems_ = {
				...this.preUploadedItems_,
				...response.items,
			};
		};

		while (itemsToUpload.length) {
			const itemToUpload = itemsToUpload.pop();
			const itemSize = itemToUpload.name.length + itemToUpload.body.length;
            
			if (itemSize > this.maxBatchSize) {
                throw new Error(`Itemsize of ${JSON.stringify(itemToUpload)} greater than maxBatchSize = ${this.maxBatchSize}`)
            }

			if (batchSize + itemSize > this.maxBatchSize) {
				await uploadBatch(currentBatch);
				batchSize = itemSize;
				currentBatch = [itemToUpload];
			} else {
				batchSize += itemSize;
				currentBatch.push(itemToUpload);
			}
		}

		if (currentBatch.length) await uploadBatch(currentBatch);
	}

}
