import { Router } from 'express';
import { superAdminController } from '../../superAdmin.module.js';

const router = Router();

router.post('/register', (req, res) =>
  superAdminController.register(req, res)
);

router.post('/login', (req, res) =>
  superAdminController.login(req, res)
);

export default router;