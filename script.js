const chatContainer = document.getElementById('chatContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const examplePrompts = document.getElementById('examplePrompts');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const newChatBtn = document.getElementById('newChatBtn');
const creatorInfoBtn = document.querySelector('.creator-info-btn');
const creatorInfoModal = document.getElementById('creatorInfoModal');
const toast = document.getElementById('toast');

// Gemini API Key and Endpoint
const GEMINI_API_KEY = "AIzaSyBjTNLLlkAiTEYinmfREes63K1Ql2vc26I";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// Mock AI fallback responses
const MOCK_AI_RESPONSES = [
  "I'm MY, your futuristic AI assistant created by MIKIAS. How can I help you today?",
  "That's an interesting question. Let me think about it...",
  "Based on my analysis, I would recommend considering these options...",
  "I've processed your request and found some relevant information.",
  "The answer to your question involves several factors. Let me explain...",
  "I'm designed by MIKIAS to assist with a wide range of tasks. What else would you like to know?"
];

// State
let messages = [];
let isTyping = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Show welcome toast
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
    setTimeout(() => {
      toast.style.transform = 'translateX(150%)';
    }, 5000);
  }, 1000);

  // Example prompt buttons
  document.querySelectorAll('.example-prompt-btn').forEach(button => {
    button.addEventListener('click', () => {
      handleSendMessage(button.textContent);
    });
  });

  // Message form submission
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && !isTyping) {
      handleSendMessage(message);
    }
  });

  // Enable/disable send button based on input
  messageInput.addEventListener('input', () => {
    sendButton.disabled = messageInput.value.trim() === '';
  });

  // New chat button
  newChatBtn.addEventListener('click', () => {
    handleNewChat();
  });

  // Creator info modal
  creatorInfoBtn.addEventListener('click', () => {
    toggleCreatorModal();
  });

  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    if (creatorInfoModal.style.display === 'block' &&
        !creatorInfoModal.contains(e.target) &&
        !creatorInfoBtn.contains(e.target)) {
      toggleCreatorModal();
    }
  });
});

// Start a new chat
function handleNewChat() {
  messages = [];
  updateChatUI();
}

// Handle sending a message
function handleSendMessage(content) {
  const userMessage = {
    id: `user-${Date.now()}`,
    content,
    sender: 'user',
    timestamp: new Date()
  };

  messages.push(userMessage);
  messageInput.value = '';
  sendButton.disabled = true;
  updateChatUI();

  // Choose between mock response or real API call
  if (GEMINI_API_KEY && GEMINI_API_KEY !== "YOUR_API_KEY_HERE") {
    generateAIResponseWithGemini(content);
  } else {
    simulateResponse(content);
  }
}

// Generate mock AI response
function simulateResponse(userMessage) {
  isTyping = true;
  updateChatUI();

  const lowerCaseMessage = userMessage.toLowerCase();

  // Detect if asking about the creator
  const isCreatorQuestion = lowerCaseMessage.includes('create') || 
                          lowerCaseMessage.includes('made') || 
                          lowerCaseMessage.includes('develop') ||
                          lowerCaseMessage.includes('mikias');

  // Detect if asking about the AI identity or capabilities
  const isAIIdentityQuestion = lowerCaseMessage.includes('who are you') ||
                             lowerCaseMessage.includes('what are you') ||
                             lowerCaseMessage.includes('your name') ||
                             lowerCaseMessage.includes('what can you do') ||
                             lowerCaseMessage.includes('are you real') ||
                             lowerCaseMessage.includes('about you');

  const responseTime = Math.floor(Math.random() * 2000) + 1000;

  setTimeout(() => {
    let aiResponse = "";

    if (isCreatorQuestion) {
      aiResponse = "I was created by MIKIAS, a pioneering AI researcher and developer. He designed me to be a futuristic assistant capable of helping with a wide range of tasks.";
    } else if (isAIIdentityQuestion) {
      aiResponse = "I'm MY, your futuristic AI assistant designed to chat, help with tasks, and provide information. I blend personality with intelligence to make every conversation feel human.";
    } else {
      aiResponse = MOCK_AI_RESPONSES[Math.floor(Math.random() * MOCK_AI_RESPONSES.length)];
    }

    const aiMessage = {
      id: `ai-${Date.now()}`,
      content: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };

    messages.push(aiMessage);
    isTyping = false;
    updateChatUI();
  }, responseTime);
}

// Generate response using Gemini API
// Generate response using Gemini 2.0 Flash API
async function generateAIResponseWithGemini(userInput) {
    isTyping = true;
    updateChatUI();
  
    const lowerCaseMessage = userInput.toLowerCase();
    const isCreatorQuestion = lowerCaseMessage.includes('create') || 
                              lowerCaseMessage.includes('made') || 
                              lowerCaseMessage.includes('develop') ||
                              lowerCaseMessage.includes('mikias');
  
    const isAIIdentityQuestion = lowerCaseMessage.includes('who are you') ||
                                 lowerCaseMessage.includes('what are you') ||
                                 lowerCaseMessage.includes('your name') ||
                                 lowerCaseMessage.includes('what can you do') ||
                                 lowerCaseMessage.includes('are you real') ||
                                 lowerCaseMessage.includes('about you');
  
    if (isCreatorQuestion || isAIIdentityQuestion) {
      let aiResponse = "";
  
      if (isCreatorQuestion) {
        aiResponse = "I was created by MIKIAS, a pioneering AI researcher and developer. He designed me to be a futuristic assistant capable of helping with a wide range of tasks.";
      } else if (isAIIdentityQuestion) {
        aiResponse = "I'm MY, your futuristic AI assistant designed to chat, help with tasks, and provide information. I blend personality with intelligence to make every conversation feel human.";
      }
  
      messages.push({
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      });
  
      isTyping = false;
      updateChatUI();
      return; // prevent calling the API
    }
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: userInput }]
              }
            ]
          })
        }
      );
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     "I couldn't generate a response. Please try again.";
  
      const aiMessage = {
        id: `ai-${Date.now()}`,
        content: aiText,
        sender: 'ai',
        timestamp: new Date()
      };
  
      messages.push(aiMessage);
    } catch (error) {
      console.error("Gemini API Error:", error.message);
      messages.push({
        id: `ai-${Date.now()}`,
        content: "Oops! Something went wrong. Try again later.",
        sender: 'ai',
        timestamp: new Date()
      });
    } finally {
      isTyping = false;
      updateChatUI();
    }
  }
  

// Update the chat UI
function updateChatUI() {
  if (messages.length > 0) {
    welcomeScreen.style.display = 'none';
    examplePrompts.style.display = 'none';
  } else {
    welcomeScreen.style.display = 'flex';
    examplePrompts.style.display = 'flex';
    chatContainer.querySelectorAll('.message, .typing-indicator').forEach(el => el.remove());
    return;
  }

  // Clear existing messages
  chatContainer.querySelectorAll('.message, .typing-indicator').forEach(el => el.remove());

  // Add all messages
  messages.forEach((message, index) => {
    const messageEl = createMessageElement(message, index);
    chatContainer.appendChild(messageEl);
  });

  // Add typing indicator if needed
  if (isTyping) {
    const typingIndicator = createTypingIndicator();
    chatContainer.appendChild(typingIndicator);
  }

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Create a message element
function createMessageElement(message, index) {
  const messageEl = document.createElement('div');
  messageEl.className = `message ${message.sender}`;
  messageEl.style.animationDelay = `${index * 100}ms`;

  const content = document.createElement('div');
  content.className = 'message-content';

  const bubbleContainer = document.createElement('div');
  bubbleContainer.className = 'message-bubble-container';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = message.sender === 'ai' ? 'MY' : 'You';

  const bubbleWrapper = document.createElement('div');
  bubbleWrapper.className = 'message-bubble-wrapper';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = message.content;

  const timestamp = document.createElement('div');
  timestamp.className = 'message-timestamp';
  timestamp.textContent = formatTime(message.timestamp);

  bubbleWrapper.appendChild(bubble);
  bubbleWrapper.appendChild(timestamp);
  bubbleContainer.appendChild(avatar);
  bubbleContainer.appendChild(bubbleWrapper);
  content.appendChild(bubbleContainer);
  messageEl.appendChild(content);

  return messageEl;
}

// Create typing indicator
function createTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';

  const content = document.createElement('div');
  content.className = 'typing-content';

  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = 'MY';

  const dots = document.createElement('div');
  dots.className = 'typing-dots';
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    dots.appendChild(dot);
  }

  content.appendChild(avatar);
  content.appendChild(dots);
  indicator.appendChild(content);

  return indicator;
}

// Format time
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Toggle creator modal
function toggleCreatorModal() {
  creatorInfoModal.style.display =
    creatorInfoModal.style.display === 'block' ? 'none' : 'block';
}