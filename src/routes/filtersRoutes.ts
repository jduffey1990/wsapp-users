// src/routes/filtersRoutes.ts
import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';
import { FiltersService } from '../controllers/filtersService';
import { UserSafe } from '../models/user';

export const filtersRoutes: ServerRoute[] = [
  // GET /api/users/:userId/filters - Get user's filters
  {
    method: 'GET',
    path: '/users/{userId}/filters',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { userId } = request.params;
        const authUser = request.auth.credentials as UserSafe;

        // Verify user can only access their own filters
        if (authUser.id !== userId) {
          return h.response({ error: 'Unauthorized' }).code(403);
        }

        const filters = await FiltersService.getUserFilters(userId);
        return h.response(filters).code(200);
      } catch (error: any) {
        console.error('Error fetching user filters:', error);
        return h.response({ error: error.message }).code(500);
      }
    },
    options: { auth: 'jwt' }
  },

  // PUT /api/users/:userId/filters - Update user's filters
  {
    method: 'PUT',
    path: '/users/{userId}/filters',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { userId } = request.params;
        const authUser = request.auth.credentials as UserSafe;

        // Verify user can only update their own filters
        if (authUser.id !== userId) {
          return h.response({ error: 'Unauthorized' }).code(403);
        }

        const updates = request.payload as any;
        const updatedFilters = await FiltersService.updateUserFilters(userId, updates);
        
        return h.response(updatedFilters).code(200);
      } catch (error: any) {
        console.error('Error updating user filters:', error);
        return h.response({ error: error.message }).code(500);
      }
    },
    options: { auth: 'jwt' }
  },

  // PATCH /api/users/:userId/filters/reset - Reset filters to unconfigured
  {
    method: 'PATCH',
    path: '/users/{userId}/filters/reset',
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const { userId } = request.params;
        const authUser = request.auth.credentials as UserSafe;

        // Verify user can only reset their own filters
        if (authUser.id !== userId) {
          return h.response({ error: 'Unauthorized' }).code(403);
        }

        const resetFilters = await FiltersService.resetUserFilters(userId);
        return h.response(resetFilters).code(200);
      } catch (error: any) {
        console.error('Error resetting user filters:', error);
        return h.response({ error: error.message }).code(500);
      }
    },
    options: { auth: 'jwt' }
  }
];