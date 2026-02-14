import { Router } from 'express';
import { UserController } from './user.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { createDoctorZodSchema } from './user.validation';
import { checkAuth } from '../../middleware/checkAuth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

router.post(
  '/create-doctor',

  //   (req, res, next) => {
  //     const parsedResult = createDoctorZodSchema.safeParse(req.body);

  //     if (!parsedResult.success) {
  //       next(parsedResult.error);
  //     }

  //     // Sanitizing the data
  //     req.body = parsedResult.data;
  //     next();
  //   },

  validateRequest(createDoctorZodSchema),

  UserController.createDoctor,
);
// TODO: Only super admin can create admin and super admin
// router.post('/create-admin', UserController.createDoctor);
// router.post('/create-superadmin', UserController.createDoctor);

router.post(
  '/create-admin',
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.createAdmin,
);

export const UserRoutes = router;
