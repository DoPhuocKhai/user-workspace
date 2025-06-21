document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const clearChatButton = document.getElementById('clearChat');

    // Function to create a message element
    const createMessageElement = (message, isUser = false) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-start';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'flex-shrink-0';

        const avatarInner = document.createElement('div');
        avatarInner.className = `h-8 w-8 rounded-full ${isUser ? 'bg-gray-300' : 'bg-black'} flex items-center justify-center`;

        const avatarText = document.createElement('span');
        avatarText.className = 'text-white text-sm';
        avatarText.textContent = isUser ? 'You' : 'AI';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'ml-3';

        const messageBubble = document.createElement('div');
        messageBubble.className = `${isUser ? 'bg-gray-200' : 'bg-gray-100'} rounded-lg px-4 py-3 max-w-lg`;

        const messageText = document.createElement('p');
        messageText.className = 'text-sm text-gray-900';
        messageText.textContent = message;

        // Assemble the message element
        avatarInner.appendChild(avatarText);
        avatarDiv.appendChild(avatarInner);
        messageBubble.appendChild(messageText);
        contentDiv.appendChild(messageBubble);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);

        return messageDiv;
    };

    // Function to add a message to the chat
    const addMessage = (message, isUser = false) => {
        const messageElement = createMessageElement(message, isUser);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Function to add a loading message
    const addLoadingMessage = () => {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loadingMessage';
        loadingDiv.className = 'flex items-start';

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'flex-shrink-0';

        const avatarInner = document.createElement('div');
        avatarInner.className = 'h-8 w-8 rounded-full bg-black flex items-center justify-center';

        const avatarText = document.createElement('span');
        avatarText.className = 'text-white text-sm';
        avatarText.textContent = 'AI';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'ml-3';

        const messageBubble = document.createElement('div');
        messageBubble.className = 'bg-gray-100 rounded-lg px-4 py-3 max-w-lg';

        const loadingDots = document.createElement('div');
        loadingDots.className = 'flex space-x-2';
        loadingDots.innerHTML = `
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        `;

        messageBubble.appendChild(loadingDots);
        contentDiv.appendChild(messageBubble);
        avatarInner.appendChild(avatarText);
        avatarDiv.appendChild(avatarInner);
        loadingDiv.appendChild(avatarDiv);
        loadingDiv.appendChild(contentDiv);

        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    // Function to remove loading message
    const removeLoadingMessage = () => {
        const loadingMessage = document.getElementById('loadingMessage');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    };

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const message = messageInput.value.trim();
        if (!message) return;

        // Clear input
        messageInput.value = '';

        // Add user message to chat
        addMessage(message, true);

        // Show loading state
        addLoadingMessage();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            // Remove loading message
            removeLoadingMessage();

            if (response.ok && data.success) {
                // Add AI response to chat
                addMessage(data.message);
            } else {
                // Add error message
                addMessage('Sorry, I encountered an error. Please try again.');
            }

        } catch (error) {
            // Remove loading message
            removeLoadingMessage();
            // Add error message
            addMessage('Sorry, I encountered an error. Please try again.');
        }
    });

    // Handle clear chat
    clearChatButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/chat/clear', {
                method: 'POST'
            });

            if (response.ok) {
                // Clear chat messages except the welcome message
                while (chatMessages.children.length > 1) {
                    chatMessages.removeChild(chatMessages.lastChild);
                }
            }
        } catch (error) {
            console.error('Failed to clear chat:', error);
        }
    });

    // Focus input on page load
    messageInput.focus();
});
