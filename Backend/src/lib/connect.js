import mongoose from 'mongoose';

export function connectDB() {
    mongoose.connect(process.env.DATABASE_URL);
    const database = mongoose.connection;
    database.on('error', (error) => {
        console.log("Database Connection Error:", error);
    });
    database.once('connected', () => {
        console.log('Database Connected');
    });
}