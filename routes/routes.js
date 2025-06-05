import express from "express"
import * as Controllers from "../controllers/controllers.js"
const router =express.Router()

router.get('/', Controllers.getBill);
router.get('//:id', Controllers.getBillById);
router.post('/', Controllers.createBill);    
router.post('/:id/storno', Controllers.stornoBill);
router.put('/:id/storno', Controllers.stornoBill);

export default router