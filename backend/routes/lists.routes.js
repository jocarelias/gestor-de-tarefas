const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Obter todas as listas do usuário
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT l.*, 
                    COUNT(t.id) as total_tasks,
                    COUNT(CASE WHEN t.completed THEN 1 END) as completed_tasks
             FROM lists l
             LEFT JOIN tasks t ON l.id = t.list_id
             WHERE l.user_id = $1
             GROUP BY l.id
             ORDER BY l.created_at DESC`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar listas:', error);
        res.status(500).json({ error: error.message });
    }
});

// Criar nova lista
router.post('/', authenticateToken, async (req, res) => {
    const { title, description, color } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO lists (user_id, title, description, color) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, title, description, color || '#4A90E2']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar lista:', error);
        res.status(500).json({ error: error.message });
    }
});

// Atualizar lista
router.put('/:id', authenticateToken, async (req, res) => {
    const { title, description, color } = req.body;
    try {
        const result = await db.query(
            'UPDATE lists SET title = $1, description = $2, color = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [title, description, color, req.params.id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar lista:', error);
        res.status(500).json({ error: error.message });
    }
});

// Deletar lista
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM lists WHERE id = $1 AND user_id = $2 RETURNING id',
            [req.params.id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }
        res.json({ message: 'Lista deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar lista:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
