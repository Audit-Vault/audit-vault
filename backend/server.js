"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const authentication_1 = __importDefault(require("./routes/authentication"));
const cors_1 = __importDefault(require("cors"));
const instructions_1 = __importDefault(require("./routes/instructions"));
dotenv_1.default.config();
colors_1.default.enable();
const app = (0, express_1.default)();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 4000;
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", authentication_1.default);
app.use("/api/instructions", instructions_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the backend API",
        endpoints: {
            "/api/auth": "Authentication routes",
            "/api/instructions": "Instructions routes"
        }
    });
});
app.listen(PORT, () => {
    const connectToMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const conn = yield mongoose_1.default.connect(MONGO_URI);
            console.log("Successfully connected to MongoDB on host:".yellow, `${conn.connection.host}`.green.bold);
            console.log(`Server listening on port ${PORT}!`.yellow.bold);
        }
        catch (error) {
            console.error(error.toString().red.bold);
        }
    });
    connectToMongoDB();
});
