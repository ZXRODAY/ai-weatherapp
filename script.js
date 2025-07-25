// Configuration
const CONFIG = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "" // API key loaded from environment variable
};

// DOM elements
const cityElement = document.querySelector('.city');
const dateElement = document.querySelector('.date');
const tempElement = document.querySelector('.temp');
const feelsLikeElement = document.querySelector('.feels-like');
const weatherEmojiElement = document.querySelector('.weather-icon .emoji');
const windElement = document.querySelector('.wind');
const humidityElement = document.querySelector('.humidity');
const pressureElement = document.querySelector('.pressure');
const errorMessageElement = document.querySelector('.error-message');
const weatherCard = document.querySelector('.weather-card');

// Add loading class initially
weatherCard.classList.add('loading');

// Default location (New Delhi, India) as fallback
const DEFAULT_LOCATION = {
    latitude: 28.6139,
    longitude: 77.2090,
    name: 'New Delhi, India'
};

// Create retry button element
const retryButton = document.createElement('button');
retryButton.textContent = 'Retry with Location';
retryButton.className = 'retry-button';
retryButton.style.display = 'none';
retryButton.style.margin = '15px auto 0';
retryButton.style.padding = '10px 15px';
retryButton.style.backgroundColor = '#6e8efb';
retryButton.style.color = 'white';
retryButton.style.border = 'none';
retryButton.style.borderRadius = '5px';
retryButton.style.cursor = 'pointer';
retryButton.style.fontWeight = 'bold';
retryButton.style.display = 'block';
weatherCard.appendChild(retryButton);

// Create fallback button element
const fallbackButton = document.createElement('button');
fallbackButton.textContent = 'Use Default Location';
fallbackButton.className = 'fallback-button';
fallbackButton.style.display = 'none';
fallbackButton.style.margin = '10px auto 0';
fallbackButton.style.padding = '10px 15px';
fallbackButton.style.backgroundColor = '#a777e3';
fallbackButton.style.color = 'white';
fallbackButton.style.border = 'none';
fallbackButton.style.borderRadius = '5px';
fallbackButton.style.cursor = 'pointer';
fallbackButton.style.fontWeight = 'bold';
fallbackButton.style.display = 'block';
weatherCard.appendChild(fallbackButton);

// Weather emoji mapping
const weatherEmojis = {
    Clear: '☀️',
    Clouds: {
        'few clouds': '🌤️',
        'scattered clouds': '⛅',
        'broken clouds': '☁️',
        'overcast clouds': '☁️'
    },
    Rain: {
        'light rain': '🌦️',
        'moderate rain': '🌧️',
        'heavy intensity rain': '⛈️',
        'default': '🌧️'
    },
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Smoke: '🌫️',
    Dust: '🌫️',
    Sand: '🌫️',
    Ash: '🌫️',
    Squall: '💨',
    Tornado: '🌪️'
};

// Format date
function formatDate(date) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

// Get emoji based on weather condition
function getWeatherEmoji(weatherMain, weatherDescription) {
    if (weatherEmojis[weatherMain]) {
        if (typeof weatherEmojis[weatherMain] === 'object') {
            return weatherEmojis[weatherMain][weatherDescription] || weatherEmojis[weatherMain]['default'] || '🌈';
        }
        return weatherEmojis[weatherMain];
    }
    return '🌈'; // Default emoji if weather condition not found
}

// Display weather data
function displayWeatherData(data) {
    const weatherMain = data.weather[0].main;
    const weatherDescription = data.weather[0].description;
    
    cityElement.textContent = `${data.name}, ${data.sys.country}`;
    dateElement.textContent = formatDate(new Date());
    tempElement.textContent = `${Math.round(data.main.temp)}°C`;
    feelsLikeElement.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    weatherEmojiElement.textContent = getWeatherEmoji(weatherMain, weatherDescription);
    windElement.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`; // Convert m/s to km/h
    humidityElement.textContent = `${data.main.humidity}%`;
    pressureElement.textContent = `${data.main.pressure} hPa`;
    
    console.log('Weather data displayed successfully:', data);
    
    // Remove loading class
    weatherCard.classList.remove('loading');
    
    // Hide retry and fallback buttons if they were shown
    retryButton.style.display = 'none';
    fallbackButton.style.display = 'none';
    
    // Hide error message if it was shown
    errorMessageElement.style.display = 'none';
    
    // Update weather context for chatbot if it's initialized
    if (window.updateWeatherContext) {
        window.updateWeatherContext(data);
    }
}

// Show error message
function showError(message) {
    console.error('Error:', message);
    errorMessageElement.querySelector('p').textContent = message;
    errorMessageElement.style.display = 'block';
    weatherCard.classList.remove('loading');
}

// Generate mock weather data based on coordinates
function generateMockWeatherData(latitude, longitude) {
    console.log('Generating mock weather data for coordinates:', latitude, longitude);
    
    // Use latitude to vary temperature (hotter near equator, colder near poles)
    const baseTemp = 25; // Base temperature in Celsius
    const latitudeEffect = Math.abs(latitude) / 90 * 30; // Max 30 degree difference based on latitude
    const temperature = baseTemp - latitudeEffect;
    
    // Random variations for realistic data
    const randomTemp = Math.random() * 10 - 5; // -5 to +5 random variation
    const finalTemp = temperature + randomTemp;
    
    // Determine weather condition based on temperature and random factor
    let weatherMain, weatherDescription;
    const randomFactor = Math.random();
    
    if (finalTemp > 30) {
        weatherMain = 'Clear';
        weatherDescription = 'clear sky';
    } else if (finalTemp > 20) {
        if (randomFactor < 0.7) {
            weatherMain = 'Clear';
            weatherDescription = 'clear sky';
        } else {
            weatherMain = 'Clouds';
            weatherDescription = 'few clouds';
        }
    } else if (finalTemp > 10) {
        if (randomFactor < 0.4) {
            weatherMain = 'Clear';
            weatherDescription = 'clear sky';
        } else if (randomFactor < 0.7) {
            weatherMain = 'Clouds';
            weatherDescription = 'scattered clouds';
        } else {
            weatherMain = 'Clouds';
            weatherDescription = 'broken clouds';
        }
    } else if (finalTemp > 0) {
        if (randomFactor < 0.3) {
            weatherMain = 'Clouds';
            weatherDescription = 'overcast clouds';
        } else if (randomFactor < 0.6) {
            weatherMain = 'Rain';
            weatherDescription = 'light rain';
        } else {
            weatherMain = 'Rain';
            weatherDescription = 'moderate rain';
        }
    } else {
        if (randomFactor < 0.5) {
            weatherMain = 'Snow';
            weatherDescription = 'light snow';
        } else {
            weatherMain = 'Snow';
            weatherDescription = 'snow';
        }
    }
    
    // Generate city name based on coordinates (just for demonstration)
    let cityName, countryCode;
    
    if (Math.abs(latitude - DEFAULT_LOCATION.latitude) < 1 &&
        Math.abs(longitude - DEFAULT_LOCATION.longitude) < 1) {
        // If coordinates are close to default location, use default location name
        cityName = 'New Delhi';
        countryCode = 'IN';
    } else {
        // Otherwise generate a generic name based on coordinates
        cityName = `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
        countryCode = 'WL'; // World
    }
    
    // Create mock weather data object similar to OpenWeatherMap API response
    return {
        name: cityName,
        sys: {
            country: countryCode
        },
        main: {
            temp: finalTemp,
            feels_like: finalTemp - 2 + (Math.random() * 4),
            humidity: Math.floor(30 + Math.random() * 70),
            pressure: Math.floor(980 + Math.random() * 40)
        },
        weather: [
            {
                main: weatherMain,
                description: weatherDescription
            }
        ],
        wind: {
            speed: 1 + Math.random() * 9, // 1-10 m/s
            deg: Math.floor(Math.random() * 360)
        }
    };
}

// Fetch weather data (now using mock data)
async function fetchWeatherData(latitude, longitude) {
    try {
        console.log('Fetching weather data for coordinates:', latitude, longitude);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock weather data instead of API call
        const data = generateMockWeatherData(latitude, longitude);
        
        console.log('Weather data received:', data);
        displayWeatherData(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Unable to fetch weather data. Please try again later.');
    }
}

// Get user's location
function getUserLocation() {
    console.log('Requesting user location...');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Geolocation successful:', position.coords);
                const { latitude, longitude } = position.coords;
                fetchWeatherData(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                
                // Show error message with retry options
                let errorMsg = 'Unable to get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMsg += 'Location access was denied.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMsg += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMsg += 'The request to get location timed out.';
                        break;
                    default:
                        errorMsg += 'An unknown error occurred.';
                }
                
                showError(errorMsg);
                
                // Show retry and fallback buttons
                retryButton.style.display = 'block';
                fallbackButton.style.display = 'block';
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser');
        showError('Geolocation is not supported by your browser. Using default location.');
        useFallbackLocation();
    }
}

// Use fallback location
function useFallbackLocation() {
    console.log('Using fallback location:', DEFAULT_LOCATION);
    cityElement.textContent = DEFAULT_LOCATION.name + ' (Default)';
    fetchWeatherData(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
    
    // Hide the fallback button since we're already using the fallback
    fallbackButton.style.display = 'none';
}

// Event listeners for buttons
retryButton.addEventListener('click', () => {
    console.log('Retry button clicked');
    errorMessageElement.style.display = 'none';
    retryButton.style.display = 'none';
    fallbackButton.style.display = 'none';
    weatherCard.classList.add('loading');
    getUserLocation();
});

fallbackButton.addEventListener('click', () => {
    console.log('Fallback button clicked');
    errorMessageElement.style.display = 'none';
    retryButton.style.display = 'none';
    fallbackButton.style.display = 'none';
    weatherCard.classList.add('loading');
    useFallbackLocation();
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing weather app');
    getUserLocation();
    initChatbot();
});

// Chatbot functionality
function initChatbot() {
    // DOM elements for chatbot
    const chatButton = document.querySelector('.chat-button');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatButton = document.querySelector('.close-chat-button');
    const chatInput = document.querySelector('.chat-input');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.querySelector('.chat-messages');
    const typingIndicator = document.querySelector('.typing-indicator');
    
    // Current weather data for context
    let currentWeatherData = null;
    
    // Event listeners
    chatButton.addEventListener('click', toggleChatbot);
    closeChatButton.addEventListener('click', toggleChatbot);
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Toggle chatbot visibility
    function toggleChatbot() {
        const isVisible = chatbotContainer.style.display !== 'none';
        chatbotContainer.style.display = isVisible ? 'none' : 'flex';
        
        // If opening the chatbot, focus the input
        if (!isVisible) {
            chatInput.focus();
        }
    }
    
    // Send a message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Process the message and get a response
        processMessage(message);
    }
    
    // Add a message to the chat
    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message;
        
        messageElement.appendChild(messageContent);
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }
    
    // Process the message and generate a response
    async function processMessage(message) {
        console.log("Processing message:", message);
        
        try {
            // Call Gemini API
            const response = await callGeminiAPI(message);
            console.log("Bot response:", response);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add bot response to chat
            addMessageToChat(response, 'bot');
        } catch (error) {
            console.error("Error processing message:", error);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Show error message to user
            addMessageToChat("I'm having trouble connecting to my knowledge base right now. Please try again later.", 'bot');
        }
    }
    
    // Generate dummy responses based on message content
    function getDummyResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Get current temperature if available
        const currentTemp = tempElement ? tempElement.textContent : "unknown temperature";
        const currentLocation = cityElement ? cityElement.textContent : "your location";
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return `Hello! How can I help you with the weather today?`;
        } else if (lowerMessage.includes('temperature')) {
            return `The current temperature in ${currentLocation} is ${currentTemp}.`;
        } else if (lowerMessage.includes('rain') || lowerMessage.includes('raining')) {
            return `Based on the current conditions, it doesn't look like rain is in the immediate forecast. Would you like me to check the extended forecast?`;
        } else if (lowerMessage.includes('forecast') || lowerMessage.includes('tomorrow')) {
            return `I'm currently set up to provide information about current conditions only. In the future, I'll be able to give you detailed forecasts!`;
        } else if (lowerMessage.includes('cold') || lowerMessage.includes('hot')) {
            return `With ${currentTemp}, I would describe the weather as moderate. Remember to dress appropriately for these conditions!`;
        } else if (lowerMessage.includes('thank')) {
            return `You're welcome! Feel free to ask if you have any other weather-related questions.`;
        } else if (lowerMessage.includes('humidity')) {
            const humidity = document.querySelector('.humidity') ? document.querySelector('.humidity').textContent : "unknown";
            return `The current humidity in ${currentLocation} is ${humidity}.`;
        } else if (lowerMessage.includes('wind')) {
            const wind = document.querySelector('.wind') ? document.querySelector('.wind').textContent : "unknown";
            return `The current wind speed in ${currentLocation} is ${wind}.`;
        } else {
            return `I'm still learning about weather patterns. In the future, I'll be able to provide more detailed information about your question regarding "${message}".`;
        }
    }
    
    // Function to call Gemini API
    async function callGeminiAPI(prompt) {
        try {
            // Get current weather data for context
            const weatherContext = buildWeatherContext();
            
            // Build the prompt with weather context
            const contextualPrompt = `Based on the current temperature ${weatherContext.temperature} in ${weatherContext.location} with ${weatherContext.conditions} conditions, wind speed of ${weatherContext.wind}, humidity of ${weatherContext.humidity}, and pressure of ${weatherContext.pressure}: ${prompt}`;
            
            console.log("Sending to Gemini API:", contextualPrompt);
            
            // Make the API call
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: contextualPrompt
                            }]
                        }]
                    }),
                }
            );
            
            // Check if the response is ok
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Gemini API error:", errorData);
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            // Parse the response
            const data = await response.json();
            
            // Check if we have a valid response
            if (data.candidates && data.candidates[0] && data.candidates[0].content &&
                data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error("Unexpected API response format:", data);
                throw new Error("Invalid API response format");
            }
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            throw error;
        }
    }
    
    // Build weather context object from current data
    function buildWeatherContext() {
        return {
            temperature: tempElement ? tempElement.textContent : "unknown temperature",
            location: cityElement ? cityElement.textContent : "unknown location",
            conditions: weatherEmojiElement ? weatherEmojiElement.textContent : "unknown conditions",
            wind: windElement ? windElement.textContent : "unknown",
            humidity: humidityElement ? humidityElement.textContent : "unknown",
            pressure: pressureElement ? pressureElement.textContent : "unknown"
        };
    }
    
    // Update current weather data for context
    function updateWeatherContext(data) {
        currentWeatherData = data;
    }
    
    // Expose the updateWeatherContext function to be called when weather data is updated
    window.updateWeatherContext = updateWeatherContext;
}