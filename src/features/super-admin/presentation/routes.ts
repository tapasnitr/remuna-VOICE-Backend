import { Router } from 'express';
import { registerSuperAdmin, loginSuperAdmin } from './superAdmin.controller';

const router = Router();

router.post('/register', registerSuperAdmin);
router.post('/login', loginSuperAdmin);

export default router;