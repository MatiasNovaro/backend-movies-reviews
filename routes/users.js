import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getUser , createUser } from "../data/users.js";
import { loginLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Público
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await getUser(name);
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const createdUser = await createUser(user);

        const payload = {
            user: {
              name: createdUser.name,
              email: createdUser.email,
            }
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});


// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Público
router.post('/login', loginLimiter, async (req, res) => {
    
    try {
        const { name, password } = req.body;
        let user = await getUser(name);
        if (!user) {
            return res.status(400).json({ msg: 'Usuario Inexistente' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales incorrectas' });
        }

        const payload = {
            user: {
              name: user.name,
              email: user.email,
            }
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

export default router;
