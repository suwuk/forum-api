/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('threads', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true
      },
      title: {
        type: 'VARCHAR(100)',
        notNull: true
      },
      body: {
        type: 'TEXT',
        notNull: true
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
      },
      date: {
        type: 'TEXT',
        notNull: true,
        default: pgm.func("TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')")
      }
    }, {
      ifNotExists: true
    })

    pgm.addConstraint(
      'threads',
      'fk_threads.owner_users.id',
      'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
    );
  }
  
  exports.down = (pgm) => {
    pgm.dropConstraint('threads', 'fk_threads.owner_users.id');
    pgm.dropTable('threads');
  };