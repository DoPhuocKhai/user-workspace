const fs = require('fs').promises;
const path = require('path');

class DataStorageService {
    constructor() {
        this.dataPath = path.join(__dirname, '..', 'data', 'crawled-data.json');
    }

    async loadData() {
        try {
            const data = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading data:', error);
            return { lastCrawled: null, pages: [] };
        }
    }

    async saveData(data) {
        try {
            await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    async updateData(newData) {
        try {
            const currentData = await this.loadData();
            const updatedData = {
                lastCrawled: new Date().toISOString(),
                pages: [...currentData.pages, ...newData]
            };
            return await this.saveData(updatedData);
        } catch (error) {
            console.error('Error updating data:', error);
            return false;
        }
    }

    async clearData() {
        try {
            const emptyData = {
                lastCrawled: null,
                pages: []
            };
            return await this.saveData(emptyData);
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }
}

module.exports = DataStorageService;
