export enum Dirnames {
	Locks = 'locks',
	Temp = 'temp',
}

export interface BaseItemEntity {
    id?: string;
    updated_time?: number;
    created_time?: number;
  }
  