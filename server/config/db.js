const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async() => {
  try {
    const conn = await mongoose.connect("mongodb+srv://harshitadhikari1122:nDxwjZ9AaIjiMJzl@cluster0.io07zq8.mongodb.net/");
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}
module.exports = connectDB;