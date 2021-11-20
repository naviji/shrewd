import BaseItem from "../models/BaseItem";
import { ModelType } from "../models/BaseModel";
import { fileApi } from "./testUtils";

export const remoteItemsByType = async (types: ModelType[]) => {
    const list = await fileApi().list('', { includeDirs: false, syncItemsOnly: true })
    const items = list.items;
  
      const output = [];
      for (const item of items) {
          const remoteContent = await fileApi().get(item.path);
          const content = await BaseItem.unserialize(remoteContent);
          if (types.indexOf(content.type_) < 0) continue;
          output.push(content);
      }
      return output;
  }