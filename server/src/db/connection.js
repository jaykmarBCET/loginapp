import mongoose from "mongoose";
import {DB_NAME} from "../../constant.js"



const connectionDb = async()=>{
    try {
     const connection =   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`mongoDb connected !! host : ${connection.connection.host}`);
    } catch (error) {
        console.log("MongoDb connection error",error)
        process.exit(1)
    }
}

export {connectionDb}