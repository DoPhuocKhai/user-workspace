const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// POST /api/chat - Get response from Gemini
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        // Get response from Gemini service
        const response = await geminiService.getResponse(message);

        if (!response.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to get response',
                error: response.error
            });
        }

        res.status(200).json({
            success: true,
            message: response.message
        });

    } catch (error) {
        console.error('Chat route error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// POST /api/chat/clear - Clear chat context
router.post('/clear', (req, res) => {
    try {
        const result = geminiService.clearContext();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to clear context',
            error: error.message
        });
    }
});

module.exports = router;
