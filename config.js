const path = require('path');

module.exports = {
    dataDir: path.join(__dirname, 'data'),
    crawledDataFile: path.join(__dirname, 'data', 'crawled-data.json'),
    maxCrawlDepth: 2,
    maxCrawlLinks: 50,
    excludePatterns: [
        /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i,
        /\/account\//,
        /\#/,
        /\?/
    ],
    port: process.env.PORT || 8000,
    geminiModel: "gemini-2.5-flash"
};
