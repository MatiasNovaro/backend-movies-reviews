import express from "express";
import { getAllMovies, getMoviesFiltered , getMovie, getTotalMoviesCount} from "../data/peliculas.js";

const router = express.Router();
router.get("/", async (req, res) => {
    try {
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
      const page = req.query.page ? parseInt(req.query.page) : 0;
      res.json(await getAllMovies(pageSize, page));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  router.get("/count", async (req, res) => {
    try {
      const {
        genres,
        title,
      } = req.query;  
      const filters = {};
      if (genres) filters.genres = { $in: [genres] };
      if (title) filters.title = { $regex: title, $options: "i" };
  
      res.json(await getTotalMoviesCount(filters));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get("/filter", async (req, res) => {
    try {
      const {
        genres,
        title,
        pageSize = 0,
        page = 0,
      } = req.query;
  
      const pagina = parseInt(page);
      const tamanioPg = parseInt(pageSize);
  
      const filters = {};
      if (genres) filters.genres = { $in: [genres] };
      if (title) filters.title = { $regex: title, $options: "i" };
  
      res.json(await getMoviesFiltered(filters, tamanioPg, pagina));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      res.json(await getMovie(id));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  export default router;