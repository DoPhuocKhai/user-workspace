const fs = require('fs').promises;
const path = require('path');

async function initializeStorage() {
    const dataDir = path.join(__dirname, 'data');
    const dataFile = path.join(dataDir, 'crawled-data.json');

    try {
        // Create data directory if it doesn't exist
        try {
            await fs.access(dataDir);
            console.log('Data directory exists');
        } catch {
            await fs.mkdir(dataDir, { recursive: true });
            console.log('Created data directory');
        }

        // Create initial data file if it doesn't exist
        try {
            await fs.access(dataFile);
            console.log('Data file exists');
        } catch {
            const initialData = {
                lastCrawled: null,
                pages: [],
                cookies: {}
            };
            await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2));
            console.log('Created initial data file');
        }

        console.log('Storage initialization complete');
    } catch (error) {
        console.error('Error initializing storage:', error);
        process.exit(1);
    }
}

// Run initialization
initializeStorage().then(() => {
    console.log('Ready to start server');
});
