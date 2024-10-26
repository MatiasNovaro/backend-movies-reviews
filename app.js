import "dotenv/config";
import express from "express";
import peliculasRouter from "./routes/peliculas.js"
import reviewsRouter from "./routes/reviews.js";
import usersRouter from "./routes/users.js"
import cors from 'cors';
const PORT = process.env.PORT;
const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use("/api/peliculas", peliculasRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log("Servidor Web en el puerto:", PORT);
});
