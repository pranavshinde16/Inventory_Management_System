"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
/*ROUTES Imports*/
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
/* Configurations */
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// app.use(cors());
// ROUTES
app.use("/dashboard", dashboardRoutes_1.default); // http://localhost:8000/dashboard
/* Server */
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
//bodyParser.urlencoded - https://dev.to/chibuezesamobisike/what-does-appusebodyparserurlencoded-extended-false-mean-12k6#:~:text=%7D));%20mean-,app.,use(bodyParser.
