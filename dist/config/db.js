"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
};
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/nodeejsblog';
const connectDb = async () => {
    const con = await mongoose_1.default.connect(mongoURI, connectionOptions);
    console.log(`MongoDB Connected: ${con.connection.host}`);
};
exports.default = connectDb;
