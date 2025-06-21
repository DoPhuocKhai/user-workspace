const express = require('express');
const router = express.Router();
const crawlerService = require('../services/crawlerService');
const geminiService = require('../services/geminiService');

// POST /api/crawl - Start a new crawl
router.post('/', async (req, res) => {
    try {
        let { url } = req.body;
        
        // If no URL provided, use default from environment variables
        if (!url) {
            url = process.env.BASE_URL;
        }

        // Validate URL
        try {
            new URL(url);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL provided'
            });
        }

        // Start crawling
        const crawlResult = await crawlerService.crawlWebsite(url);

        if (!crawlResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Crawling failed',
                error: crawlResult.error
            });
        }

        // Initialize Gemini service with crawled data
        await geminiService.initializeContext(crawlResult.data.links);

        res.status(200).json({
            success: true,
            message: 'Crawl completed successfully',
            data: {
                totalPages: crawlResult.data.totalLinks,
                domain: crawlResult.data.domain,
                links: crawlResult.data.links.map(page => ({
                    url: page.url,
                    title: page.title
                }))
            }
        });

    } catch (error) {
        console.error('Crawl route error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// GET /api/crawl/status - Get current crawl status (if needed in future)
router.get('/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Crawler is ready'
    });
});

module.exports = router;
