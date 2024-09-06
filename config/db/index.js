const mongoose = require("mongoose");
const config = require("../config");

const connectdb = async () => {
    try {
        await mongoose.connect(config.DB_URL, {  
            user: 'usr7090',
            pass: 'five-white-lion',
            dbName: 'test-umair'
        });
        console.log(`Mongodb is connected ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`this is error ${error}`);
    }
}

module.exports = connectdb; 