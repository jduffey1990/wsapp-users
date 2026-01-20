// src/routes/index.ts
import { userRoutes } from './userRoutes';
import {homeRoutes, loginRoutes} from './loginRoutes';
import { tokenRoutes } from './tokenRoutes';
import { passwordResetRoutes } from './passwordResetRoutes';

export default [
  ...userRoutes,
  ...homeRoutes,
  ...loginRoutes,
  ...tokenRoutes,
  ...passwordResetRoutes,
];