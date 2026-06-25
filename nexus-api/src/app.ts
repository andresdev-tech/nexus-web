import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import {
    swaggerUi,
    swaggerSpec,
} from "./docs/swager";

import router from "./routes/index";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(cors(
    {
        origin: "*",
    }
));
app.use(express.json());
app.use(morgan("combined"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/", router);

export default app;