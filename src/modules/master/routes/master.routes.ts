// import express from 'express';
// import { masterController } from '../controllers/master.controller';
// import { protect } from '../../../middleware/auth';

// const router = express.Router();

// router.use(protect);

// router.get('/:type', masterController.getList.bind(masterController));
// router.post('/:type', masterController.addItem.bind(masterController));
// router.put('/:type/:id', masterController.updateItem.bind(masterController));
// router.delete('/:type/:id', masterController.deleteItem.bind(masterController));

// export default router;



// import express from 'express';
// import { masterController } from '../controllers/master.controller';
// import { protect } from '../../../middleware/auth';

// const router = express.Router();

// router.use(protect);

// router.get('/:type', masterController.getList.bind(masterController));
// router.get('/:type/category/:category', masterController.getByCategory.bind(masterController));
// router.post('/:type', masterController.addItem.bind(masterController));
// router.put('/:type/:id', masterController.updateItem.bind(masterController));
// router.delete('/:type/:id', masterController.deleteItem.bind(masterController));

// export default router;






import express from 'express';
import { masterController } from '../controllers/master.controller';
import { protect } from '../../../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/:type', masterController.getList.bind(masterController));
router.get('/:type/category/:category', masterController.getByCategory.bind(masterController));
router.post('/:type', masterController.addItem.bind(masterController));
router.put('/:type/:id', masterController.updateItem.bind(masterController));
router.delete('/:type/:id', masterController.deleteItem.bind(masterController));

export default router;