// routes/auth.routes.js

import express from 'express';
import { register, login } from '../controllers/auth.controller.js'; 

const router = express.Router();

router.post('/register', register); 
router.post('/login', login);
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working!' });
});


export default router;