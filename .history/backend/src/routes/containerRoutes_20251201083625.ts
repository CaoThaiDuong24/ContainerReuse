import express from 'express';
import {
  getContainers,
  getListReUseNow,
  createContainer,
  updateContainer,
  deleteContainer
} from '../controllers/containerController';

const router = express.Router();

// GET /api/containers - Get all containers
router.get('/', getContainers);

// GET /api/containers/reuse-now - Get list of reuse containers
router.get('/reuse-now', getListReUseNow);

// POST /api/containers - Create new container
router.post('/', createContainer);

// PUT /api/containers/:id - Update container
router.put('/:id', updateContainer);

// DELETE /api/containers/:id - Delete container
router.delete('/:id', deleteContainer);

export default router;