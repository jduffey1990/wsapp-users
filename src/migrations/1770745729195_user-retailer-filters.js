/* eslint-disable camelcase */
exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create user_retailer_filters table
  pgm.createTable('user_retailer_filters', {
    user_id: { 
      type: 'uuid', 
      primaryKey: true,
      references: 'users(id)',
      onDelete: 'CASCADE'
    },
    configured: { 
      type: 'boolean', 
      notNull: true, 
      default: false,
      comment: 'Whether user has completed initial filter configuration'
    },
    active_categories: { 
      type: 'jsonb', 
      notNull: true, 
      default: '[]',
      comment: 'Array of enabled filter category names'
    },
    filters: { 
      type: 'jsonb', 
      notNull: true, 
      default: '{}',
      comment: 'User filter values (state, retailerType, etc.)'
    },
    created_at: { 
      type: 'timestamptz', 
      notNull: true, 
      default: pgm.func('now()') 
    },
    updated_at: { 
      type: 'timestamptz', 
      notNull: true, 
      default: pgm.func('now()') 
    }
  });

  // Indexes
  pgm.createIndex('user_retailer_filters', 'user_id');
  pgm.createIndex('user_retailer_filters', 'configured');
  
  // GIN index for JSONB querying
  pgm.createIndex('user_retailer_filters', 'active_categories', { method: 'gin' });
  pgm.createIndex('user_retailer_filters', 'filters', { method: 'gin' });

  // Create trigger for updated_at (reuse existing function)
  pgm.createTrigger('user_retailer_filters', 'trg_user_retailer_filters_updated_at', {
    when: 'BEFORE',
    operation: 'UPDATE',
    level: 'ROW',
    function: 'set_updated_at'
  });

  // Add comment to table
  pgm.sql(`
    COMMENT ON TABLE user_retailer_filters IS 'User-specific retailer filter configuration and values';
  `);
};

exports.down = (pgm) => {
  pgm.dropTrigger('user_retailer_filters', 'trg_user_retailer_filters_updated_at', { ifExists: true });
  pgm.dropTable('user_retailer_filters');
};