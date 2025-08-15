// MongoDB initialization script
// This script runs when the container starts for the first time

print('Starting MongoDB initialization...');

// Switch to the coreconnect database
db = db.getSiblingDB('coreconnect');

// Create users collection with validation
db.createCollection("users", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["email", "password_hash", "created_at"],
         properties: {
            email: {
               bsonType: "string",
               pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
               description: "must be a valid email address"
            },
            username: {
               bsonType: ["string", "null"],
               minLength: 3,
               maxLength: 30,
               description: "must be a string between 3 and 30 characters"
            },
            password_hash: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            first_name: {
               bsonType: ["string", "null"],
               maxLength: 50,
               description: "must be a string and is optional"
            },
            last_name: {
               bsonType: ["string", "null"],
               maxLength: 50,
               description: "must be a string and is optional"
            },
            is_active: {
               bsonType: "bool",
               description: "must be a boolean"
            },
            is_verified: {
               bsonType: "bool",
               description: "must be a boolean"
            },
            created_at: {
               bsonType: "date",
               description: "must be a date and is required"
            },
            updated_at: {
               bsonType: "date",
               description: "must be a date"
            },
            last_login: {
               bsonType: ["date", "null"],
               description: "must be a date or null"
            }
         }
      }
   }
});

// Create unique indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true, sparse: true });

// Create additional indexes for performance
db.users.createIndex({ "created_at": 1 });
db.users.createIndex({ "is_active": 1 });
db.users.createIndex({ "is_verified": 1 });

// Create sessions collection for future use (if needed for session management)
db.createCollection("sessions");
db.sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 });

print('MongoDB initialization completed successfully!');
print('Collections created: users, sessions');
print('Indexes created on email, username, created_at, is_active, is_verified');
