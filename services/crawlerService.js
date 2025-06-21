const axios = require('axios');
const cheerio = require('cheerio');
const urlLib = require('url');

class CrawlerService {
    constructor() {
        this.visited = new Set();
        this.linksFound = [];
        this.maxDepth = 2; // Reduce depth for better focus
        this.maxLinks = 50; // Reduce max links for better performance
        this.excludePatterns = [
            /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i,
            /\/account\//,
            /\#/,
            /\?/
        ];
    }

    shouldCrawl(url) {
        // Check if URL matches any exclude pattern
        return !this.excludePatterns.some(pattern => pattern.test(url));
    }

    cleanUrl(url) {
        try {
            const urlObj = new URL(url);
            // Remove trailing slashes and 'index.html'
            let cleanPath = urlObj.pathname.replace(/\/+$/, '').replace(/\/index\.html$/, '');
            // Remove /account/ from path
            cleanPath = cleanPath.replace('/account/', '/');
            return `${urlObj.protocol}//${urlObj.host}${cleanPath}`;
        } catch (error) {
            return url;
        }
    }

    async crawlWebsite(startUrl) {
        // Reset state for new crawl
        this.visited.clear();
        this.linksFound = [];
        
        try {
            const domain = new URL(startUrl).hostname;
            const cleanStartUrl = this.cleanUrl(startUrl);
            await this.crawl(cleanStartUrl, domain, 0);
            
            return {
                success: true,
                data: {
                    totalLinks: this.linksFound.length,
                    links: this.linksFound,
                    domain: domain
                }
            };
        } catch (error) {
            console.error('Crawl error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async crawl(url, domain, depth) {
        // Check limits
        if (depth > this.maxDepth || 
            this.visited.has(url) || 
            this.linksFound.length >= this.maxLinks) {
            return;
        }

        try {
            this.visited.add(url);
            console.log(`Crawling: ${url}`);

            const response = await axios.get(url, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; EducationalBot/1.0)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Connection': 'keep-alive'
                },
                maxRedirects: 5
            });

            const $ = cheerio.load(response.data);
            const pageData = {
                url: url,
                title: $('title').text().trim(),
                description: $('meta[name="description"]').attr('content'),
                content: this.extractMainContent($)
            };

            this.linksFound.push(pageData);

            // Extract and follow links
            const links = this.extractLinks($, url, domain);
            for (const link of links) {
                await this.crawl(link, domain, depth + 1);
            }

        } catch (error) {
            console.error(`Error crawling ${url}:`, error.message);
        }
    }

    extractLinks($, currentUrl, domain) {
        const links = new Set();
        
        $('a').each((_, element) => {
            let href = $(element).attr('href');
            if (!href) return;

            try {
                // Convert relative URLs to absolute
                href = urlLib.resolve(currentUrl, href);
                const url = new URL(href);
                
                // Clean and validate URL
                if (url.hostname === domain) {
                    const cleanHref = this.cleanUrl(href);
                    if (!this.visited.has(cleanHref) && !links.has(cleanHref) && this.shouldCrawl(cleanHref)) {
                        links.add(cleanHref);
                    }
                }
            } catch (error) {
                // Invalid URL, skip
            }
        });

        return Array.from(links);
    }

    extractMainContent($) {
        // Extract main content, prioritizing article content and main sections
        let content = '';

        // Try to get content from main content areas
        const mainSelectors = [
            'article',
            'main',
            '.main-content',
            '#main-content',
            '.content',
            '#content'
        ];

        for (const selector of mainSelectors) {
            const element = $(selector);
            if (element.length) {
                content += element.text().trim() + ' ';
            }
        }

        // If no main content found, get text from p tags
        if (!content.trim()) {
            $('p').each((_, element) => {
                content += $(element).text().trim() + ' ';
            });
        }

        // Clean up the content
        return content
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 1000); // Limit content length
    }
}

module.exports = new CrawlerService();
