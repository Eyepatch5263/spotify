const mongoose = require('mongoose');

const connectDB=async()=>{
    try {
        const connectDB = await mongoose.connect(process.env.MONGO_DB_URI, {
            authSource: "admin"
        })
        console.log(process.env.MONGO_DB_URI)
        console.log(`MongoDB connected: ${connectDB.connection.host}`)
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = connectDB;