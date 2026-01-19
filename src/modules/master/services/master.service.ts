// import { masterRepository } from '../repositories/master.repository';

// export class MasterService {
//   async getList(type: string, doctorId: string) {
//     return await masterRepository.findByType(type, doctorId);
//   }
  
//   async addItem(type: string, name: string, doctorId: string) {
//     return await masterRepository.create({ type, name, doctorId });
//   }
  
//   async updateItem(id: string, type: string, data: any, doctorId: string) {
//     const item = await masterRepository.update(id, data, doctorId);
//     if (!item) throw new Error('Item not found');
//     return item;
//   }
  
//   async deleteItem(id: string, type: string, doctorId: string) {
//     const item = await masterRepository.delete(id, doctorId);
//     if (!item) throw new Error('Item not found');
//     return item;
//   }
// }

// export const masterService = new MasterService();








import { masterRepository } from '../repositories/master.repository';

export class MasterService {
  async getList(type: string, doctorId: string) {
    return await masterRepository.findByType(type, doctorId);
  }
  
  // ✅ CHANGED: Category parameter add किया
  async addItem(type: string, name: string, doctorId: string, category: string = 'other') {
    return await masterRepository.create({ 
      type, 
      name, 
      category,  // ✅ Category add करो
      doctorId 
    });
  }
  
  async updateItem(id: string, type: string, data: any, doctorId: string) {
    const item = await masterRepository.update(id, data, doctorId);
    if (!item) throw new Error('Item not found');
    return item;
  }
  
  async deleteItem(id: string, type: string, doctorId: string) {
    const item = await masterRepository.delete(id, doctorId);
    if (!item) throw new Error('Item not found');
    return item;
  }
  
  // ✅ NEW: Get by category
  async getByCategory(type: string, category: string, doctorId: string) {
    return await masterRepository.findByTypeAndCategory(type, category, doctorId);
  }
}

export const masterService = new MasterService();