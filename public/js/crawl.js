document.addEventListener('DOMContentLoaded', () => {
    const crawlForm = document.getElementById('crawlForm');
    const loadingState = document.getElementById('loadingState');
    const resultsSection = document.getElementById('resultsSection');
    const errorState = document.getElementById('errorState');
    const errorMessage = document.getElementById('errorMessage');
    const totalPages = document.getElementById('totalPages');
    const crawledLinks = document.getElementById('crawledLinks');

    // Hide all states initially except the form
    const hideAllStates = () => {
        loadingState.classList.add('hidden');
        resultsSection.classList.add('hidden');
        errorState.classList.add('hidden');
    };

    // Show loading state
    const showLoading = () => {
        hideAllStates();
        loadingState.classList.remove('hidden');
    };

    // Show error state
    const showError = (message) => {
        hideAllStates();
        errorState.classList.remove('hidden');
        errorMessage.textContent = message;
    };

    // Show results
    const showResults = (data) => {
        hideAllStates();
        resultsSection.classList.remove('hidden');
        
        // Update total pages
        totalPages.textContent = data.totalPages;

        // Clear previous links
        crawledLinks.innerHTML = '';

        // Add new links
        data.links.forEach(page => {
            const linkElement = document.createElement('div');
            linkElement.className = 'p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50';
            
            const titleElement = document.createElement('h5');
            titleElement.className = 'text-sm font-medium text-gray-900';
            titleElement.textContent = page.title || 'Untitled Page';

            const urlElement = document.createElement('a');
            urlElement.className = 'text-sm text-gray-500 hover:text-black';
            urlElement.href = page.url;
            urlElement.target = '_blank';
            urlElement.textContent = page.url;

            linkElement.appendChild(titleElement);
            linkElement.appendChild(urlElement);
            crawledLinks.appendChild(linkElement);
        });
    };

    // Handle form submission
    crawlForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const urlInput = document.getElementById('url');
        const url = urlInput.value.trim();

        if (!url) {
            showError('Please enter a valid URL');
            return;
        }

        try {
            showLoading();

            const response = await fetch('/api/crawl', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to crawl website');
            }

            if (data.success) {
                showResults(data.data);
            } else {
                throw new Error(data.message || 'Failed to crawl website');
            }

        } catch (error) {
            showError(error.message);
        }
    });
});
