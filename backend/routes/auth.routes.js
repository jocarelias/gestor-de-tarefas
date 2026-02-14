const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Registro de usuário
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Verificar se usuário já existe
        const userExists = await db.query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Usuário ou email já existe' });
        }
        
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Inserir novo usuário
        const result = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );
        
        const user = result.rows[0];
        
        // Gerar token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'minha_chave_secreta_super_segura_123456',
            { expiresIn: '24h' }
        );
        
        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Buscar usuário
        const result = await db.query(
            'SELECT id, username, email, password_hash FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        const user = result.rows[0];
        
        // Verificar senha
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        // Remover hash da senha do objeto user
        delete user.password_hash;
        
        // Gerar token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'minha_chave_secreta_super_segura_123456',
            { expiresIn: '24h' }
        );
        
        res.json({ user, token });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
