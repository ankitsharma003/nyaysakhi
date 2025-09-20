// MongoDB initialization script
db = db.getSiblingDB('nyaymitra')

// Create a user for the application
db.createUser({
  user: 'nyaymitra_user',
  pwd: 'nyaymitra_password',
  roles: [
    {
      role: 'readWrite',
      db: 'nyaymitra',
    },
  ],
})

// Create collections with initial indexes
db.createCollection('users')
db.createCollection('lawyers')
db.createCollection('sessions')
db.createCollection('documents')

print('Database initialized successfully!')
