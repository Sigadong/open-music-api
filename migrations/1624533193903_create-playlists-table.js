exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(40)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(40)',
      notNull: true,
    },
    owner: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint ffk_playlists.owner_users.id pada tabel playlists
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');

  pgm.dropTable('playlists');
};
