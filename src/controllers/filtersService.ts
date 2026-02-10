// src/controllers/filtersService.ts
import { PostgresService } from './postgres.service';
import { 
  UserRetailerFilters, 
  CreateUserRetailerFiltersInput, 
  UpdateUserRetailerFiltersInput,
  createEmptyFilters 
} from '../models/userRetailerFilters';

const db = PostgresService.getInstance();

export class FiltersService {
  /**
   * Get user's retailer filters
   * Creates default entry if doesn't exist
   */
  static async getUserFilters(userId: string): Promise<UserRetailerFilters> {
    const result = await db.query<any>(
      `SELECT 
        user_id as "userId",
        configured,
        active_categories as "activeCategories",
        filters,
        created_at as "createdAt",
        updated_at as "updatedAt"
       FROM user_retailer_filters 
       WHERE user_id = $1`,
      [userId]
    );

    // If no filters exist, create default entry
    if (result.rows.length === 0) {
      return this.createUserFilters({ userId });
    }

    return result.rows[0];
  }

  /**
   * Create user filters entry (auto-called if doesn't exist)
   */
  static async createUserFilters(
    input: CreateUserRetailerFiltersInput
  ): Promise<UserRetailerFilters> {
    const { userId, configured = false, activeCategories = [], filters = {} } = input;

    const result = await db.query<any>(
      `INSERT INTO user_retailer_filters (
        user_id, configured, active_categories, filters
      ) VALUES ($1, $2, $3, $4)
      RETURNING 
        user_id as "userId",
        configured,
        active_categories as "activeCategories",
        filters,
        created_at as "createdAt",
        updated_at as "updatedAt"`,
      [userId, configured, JSON.stringify(activeCategories), JSON.stringify(filters)]
    );

    return result.rows[0];
  }

  /**
   * Update user filters
   */
  static async updateUserFilters(
    userId: string,
    updates: UpdateUserRetailerFiltersInput
  ): Promise<UserRetailerFilters> {
    const existing = await this.getUserFilters(userId);

    // Build update query dynamically based on what's provided
    const updateParts: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.configured !== undefined) {
      updateParts.push(`configured = $${paramCount++}`);
      values.push(updates.configured);
    }

    if (updates.activeCategories !== undefined) {
      updateParts.push(`active_categories = $${paramCount++}`);
      values.push(JSON.stringify(updates.activeCategories));
    }

    if (updates.filters !== undefined) {
      // Merge with existing filters
      const mergedFilters = {
        ...existing.filters,
        ...updates.filters
      };
      updateParts.push(`filters = $${paramCount++}`);
      values.push(JSON.stringify(mergedFilters));
    }

    if (updateParts.length === 0) {
      return existing; // No updates needed
    }

    values.push(userId); // WHERE clause parameter

    const result = await db.query<any>(
      `UPDATE user_retailer_filters 
       SET ${updateParts.join(', ')}
       WHERE user_id = $${paramCount}
       RETURNING 
         user_id as "userId",
         configured,
         active_categories as "activeCategories",
         filters,
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      values
    );

    return result.rows[0];
  }

  /**
   * Reset filters to unconfigured state
   */
  static async resetUserFilters(userId: string): Promise<UserRetailerFilters> {
    const result = await db.query<any>(
      `UPDATE user_retailer_filters 
       SET 
         configured = false,
         active_categories = '[]',
         filters = '{}'
       WHERE user_id = $1
       RETURNING 
         user_id as "userId",
         configured,
         active_categories as "activeCategories",
         filters,
         created_at as "createdAt",
         updated_at as "updatedAt"`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new Error('User filters not found');
    }

    return result.rows[0];
  }

  /**
   * Delete user filters (for cleanup/testing)
   */
  static async deleteUserFilters(userId: string): Promise<void> {
    await db.query(
      'DELETE FROM user_retailer_filters WHERE user_id = $1',
      [userId]
    );
  }
}