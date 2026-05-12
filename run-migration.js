// Helper script to run the security migration
const { createConnection } = require('./src/lib/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await createConnection();
  
  try {
    console.log('Running security migration...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_enhance_security.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      try {
        await connection.execute(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.code === 'ER_TABLE_EXISTS_ERROR' || 
            error.code === 'ER_DUP_FIELDNAME' || error.code === 'ER_BAD_NULL_ERROR') {
          console.log('- Skipped (already exists):', statement.substring(0, 50) + '...');
        } else {
          console.error('✗ Error in statement:', statement);
          console.error('Error:', error.message);
        }
      }
    }
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    connection.release();
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
