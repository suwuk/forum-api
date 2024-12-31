/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable(
    "comments",
    {
      id: {
        type: "VARCHAR(50)",
        notNull: true,
        primaryKey: true,
      },
      content: {
        type: "TEXT",
        notNull: true,
      },
      owner: {
        type: "VARCHAR(50)",
        notNull: true,
      },
      thread: {
        type: "VARCHAR(50)",
        notNull: true,
      },
      is_delete: {
        type: 'BOOLEAN',
        default: 'FALSE',
        notNull: true,
      },
      date: {
        type: 'TEXT',
        notNull: true,
        default: pgm.func("TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS')")
      },
    },
    {
      ifNotExists: true,
    }
  );

  pgm.addConstraint(
    'comments',
    'fk_comments.thread_threads.id',
    'FOREIGN KEY(thread) REFERENCES threads(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'comments',
    'fk_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.thread_threads.id');
  pgm.dropConstraint('comments', 'fk_comments.owner_users.id');
  pgm.dropTable('comments');
};