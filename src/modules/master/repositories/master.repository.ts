// import { Master } from '../models/master.model';

// export class MasterRepository {
//   async create(data: any) {
//     return await Master.create(data);
//   }
  
//   async findByType(type: string, doctorId: string) {
//     return await Master.find({ type, doctorId }).sort({ name: 1 });
//   }
  
//   async update(id: string, data: any, doctorId: string) {
//     return await Master.findOneAndUpdate(
//       { _id: id, doctorId },
//       data,
//       { new: true }
//     );
//   }
  
//   async delete(id: string, doctorId: string) {
//     return await Master.findOneAndDelete({ _id: id, doctorId });
//   }
// }

// export const masterRepository = new MasterRepository();







import { Master } from '../models/master.model';

export class MasterRepository {
  async create(data: any) {
    return await Master.create(data);
  }
  
  async findByType(type: string, doctorId: string) {
    return await Master.find({ type, doctorId }).sort({ name: 1 });
  }
  
  // ✅ NEW: Get by category
  async findByTypeAndCategory(type: string, category: string, doctorId: string) {
    return await Master.find({ 
      type, 
      category, 
      doctorId 
    }).sort({ name: 1 });
  }
  
  async update(id: string, data: any, doctorId: string) {
    return await Master.findOneAndUpdate(
      { _id: id, doctorId },
      data,
      { new: true }
    );
  }
  
  async delete(id: string, doctorId: string) {
    return await Master.findOneAndDelete({ _id: id, doctorId });
  }
}

export const masterRepository = new MasterRepository();