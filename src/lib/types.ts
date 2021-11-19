export enum Dirnames {
	Locks = 'locks',
	Temp = 'temp',
}

export interface BaseItemEntity {
    id?: string;
    updatedAt?: number;
    createdAt?: number;
  }
  