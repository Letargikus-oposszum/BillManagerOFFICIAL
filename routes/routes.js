import express from "express"
import * as Controllers from "../controllers/controllers.js"
const router =express.Router()

router.get('/', Controllers.getBill)
router.get('/:id', Controllers.getBillById)
router.post('/', Controllers.createBill)
router.put('/:id',Controllers.updateBill)
router.delete('/:id', Controllers.deleteBill)

export default router