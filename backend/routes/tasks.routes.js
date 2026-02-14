const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Obter tarefas de uma lista
router.get('/list/:listId', authenticateToken, async (req, res) => {
    try {
        // Verificar se a lista pertence ao usuário
        const listCheck = await db.query(
            'SELECT id FROM lists WHERE id = $1 AND user_id = $2',
            [req.params.listId, req.user.id]
        );
        
        if (listCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        const result = await db.query(
            `SELECT * FROM tasks 
             WHERE list_id = $1 
             ORDER BY 
                CASE WHEN completed THEN 1 ELSE 0 END,
                priority DESC,
                due_date ASC NULLS LAST,
                created_at DESC`,
            [req.params.listId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
        res.status(500).json({ error: error.message });
    }
});

// Criar nova tarefa
router.post('/', authenticateToken, async (req, res) => {
    const { list_id, title, description, priority, due_date } = req.body;
    try {
        // Verificar se a lista pertence ao usuário
        const listCheck = await db.query(
            'SELECT id FROM lists WHERE id = $1 AND user_id = $2',
            [list_id, req.user.id]
        );
        
        if (listCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Lista não encontrada' });
        }

        const result = await db.query(
            'INSERT INTO tasks (list_id, title, description, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [list_id, title, description, priority || 1, due_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar tarefa:', error);
        res.status(500).json({ error: error.message });
    }
});

// Atualizar tarefa
router.put('/:id', authenticateToken, async (req, res) => {
    const { title, description, priority, due_date, completed } = req.body;
    try {
        // Verificar se a tarefa pertence ao usuário
        const taskCheck = await db.query(
            `SELECT t.id FROM tasks t
             JOIN lists l ON t.list_id = l.id
             WHERE t.id = $1 AND l.user_id = $2`,
            [req.params.id, req.user.id]
        );
        
        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        const result = await db.query(
            `UPDATE tasks 
             SET title = COALESCE($1, title),
                 description = COALESCE($2, description),
                 priority = COALESCE($3, priority),
                 due_date = COALESCE($4, due_date),
                 completed = COALESCE($5, completed),
                 completed_at = CASE WHEN $5 THEN CURRENT_TIMESTAMP ELSE NULL END
             WHERE id = $6 
             RETURNING *`,
            [title, description, priority, due_date, completed, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        res.status(500).json({ error: error.message });
    }
});

// Deletar tarefa
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // Verificar se a tarefa pertence ao usuário
        const taskCheck = await db.query(
            `SELECT t.id FROM tasks t
             JOIN lists l ON t.list_id = l.id
             WHERE t.id = $1 AND l.user_id = $2`,
            [req.params.id, req.user.id]
        );
        
        if (taskCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' });
        }

        const result = await db.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING id',
            [req.params.id]
        );
        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
