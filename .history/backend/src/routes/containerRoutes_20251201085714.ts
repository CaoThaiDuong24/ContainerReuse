import express from 'express';
import {
  getContainers,
  getContainerById,
  getListReUseNow,
  createContainer,
  updateContainer,
  deleteContainer
} from '../controllers/containerController';

const router = express.Router();

// GET /api/containers/reuse-now - Get list of reuse containers (must be before /:id)
router.get('/reuse-now', getListReUseNow);

// GET /api/containers - Get all containers
router.get('/', getContainers);

// GET /api/containers/:id - Get container by ID
router.get('/:id', getContainerById);

// POST /api/containers - Create new container
router.post('/', createContainer);

// PUT /api/containers/:id - Update container
router.put('/:id', updateContainer);

// DELETE /api/containers/:id - Delete container
router.delete('/:id', deleteContainer);

export default router;