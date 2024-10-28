import "dotenv/config";
import express from "express";
import peliculasRouter from "./routes/peliculas.js"
import reviewsRouter from "./routes/reviews.js";
import usersRouter from "./routes/users.js"
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from "./middlewares/errorHandler.js";
const PORT = process.env.PORT;
const app = express();
//-----Third-party-----

//Seguridad
app.use(helmet());

//Permitir conexion con nextjs
app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

//Logging
app.use(morgan('combined'));

//-----Built-in------

//Parseador
app.use(express.json());

//Routes
app.use("/api/peliculas", peliculasRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);

//Este middleware es el encargado de gestionar todos los errores.
app.use(errorHandler);

//Iniciar servidor
app.listen(PORT,'0.0.0.0', () => {
  console.log("Servidor Web en el puerto:", PORT);
});
