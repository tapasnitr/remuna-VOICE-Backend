import { createSuperAdminUseCase } from '../application/createSuperAdmin.usecase';
import { loginSuperAdminUseCase } from '../application/loginSuperAdmin.usecase';

export const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const data = await createSuperAdminUseCase(name, email, password);

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await loginSuperAdminUseCase(email, password);

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};