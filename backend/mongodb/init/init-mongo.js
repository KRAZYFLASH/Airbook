// MongoDB initialization script for Airbook
db = db.getSiblingDB("airbook_logs");

// Create collections
db.createCollection("application_logs");
db.createCollection("audit_logs");
db.createCollection("performance_logs");
db.createCollection("error_logs");

// Create indexes for better performance
db.application_logs.createIndex({ timestamp: -1 });
db.application_logs.createIndex({ level: 1 });
db.application_logs.createIndex({ service: 1 });

db.audit_logs.createIndex({ timestamp: -1 });
db.audit_logs.createIndex({ userId: 1 });
db.audit_logs.createIndex({ action: 1 });

db.performance_logs.createIndex({ timestamp: -1 });
db.performance_logs.createIndex({ endpoint: 1 });
db.performance_logs.createIndex({ duration: -1 });

db.error_logs.createIndex({ timestamp: -1 });
db.error_logs.createIndex({ severity: 1 });
db.error_logs.createIndex({ service: 1 });

print("MongoDB collections and indexes created successfully");
