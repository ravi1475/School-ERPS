// routes/tcRoutes.js
import express from 'express';
import {
  createTC,
  getAllTCs,
  getTC,
  updateTC,
  deleteTC
} from '../controllers/tcController.js';
import {
    validateTCCreate,
    validateTCUpdate
} from '../middlewares/tcMiddleware.js';


const router = express.Router();
router.post('/tcs', validateTCCreate, createTC);
router.get('/tcs', getAllTCs);
router.get('/tcs/:id', getTC);
router.put('/tcs/:id', validateTCUpdate, updateTC);
router.delete('/tcs/:id', deleteTC);

export default router;