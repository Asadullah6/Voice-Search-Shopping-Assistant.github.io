 // Global variables
        let isListening = false;
        let recognition;
        const voiceButton = document.getElementById('voiceButton');
        const voiceStatus = document.getElementById('voiceStatus');
        const voiceText = document.getElementById('voiceText');
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');

        // Initialize Speech Recognition
        function initializeSpeechRecognition() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = function() {
                    isListening = true;
                    voiceButton.classList.add('listening');
                    voiceStatus.textContent = 'Listening... Speak now!';
                    voiceText.textContent = '';
                };

                recognition.onresult = function(event) {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript;
                    }
                    voiceText.textContent = transcript;
                    
                    // If final result, trigger search
                    if (event.results[event.results.length - 1].isFinal) {
                        setTimeout(() => {
                            searchFor(transcript);
                        }, 500);
                    }
                };

                recognition.onerror = function(event) {
                    voiceStatus.textContent = 'Error: ' + event.error + '. Click to try again.';
                    resetVoiceButton();
                };

                recognition.onend = function() {
                    resetVoiceButton();
                };
            } else {
                voiceStatus.textContent = 'Voice recognition not supported. Use text search instead.';
                voiceButton.disabled = true;
            }
        }

        function resetVoiceButton() {
            isListening = false;
            voiceButton.classList.remove('listening');
            voiceStatus.textContent = 'Click the microphone to start voice search';
        }

        // Voice button click handler
        voiceButton.addEventListener('click', function() {
            if (!isListening && recognition) {
                recognition.start();
            } else if (isListening && recognition) {
                recognition.stop();
            }
        });

        // Search functionality
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                searchFor(query);
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });

        // Main search function
        async function searchFor(query) {
            if (!query.trim()) return;

            // Update voice text
            voiceText.textContent = query;
            searchInput.value = query;

            // Show loading
            document.getElementById('mainInterface').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            document.querySelector('.back-button').style.display = 'block';

            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Generate mock results (in real app, this would call actual APIs)
            const results = generateMockResults(query);
            displayResults(query, results);
        }

        // Generate mock results for demo
        function generateMockResults(query) {
            const categories = {
                'headphone': '🎧',
                'mouse': '🖱️',
                'phone': '📱',
                'laptop': '💻',
                'watch': '⌚',
                'camera': '📷',
                'speaker': '🔊',
                'keyboard': '⌨️',
                'tablet': '📱',
                'gaming': '🎮'
            };

            let icon = '🛍️';
            for (let [key, value] of Object.entries(categories)) {
                if (query.toLowerCase().includes(key)) {
                    icon = value;
                    break;
                }
            }

            const products = [];
            const brands = ['TechPro', 'SmartBuy', 'EliteGear', 'ProMax', 'UltraDeals'];
            const stores = ['Amazon', 'Best Buy', 'Target', 'Walmart', 'Newegg'];

            for (let i = 0; i < 6; i++) {
                const price = Math.floor(Math.random() * 300 + 20);
                const rating = (Math.random() * 2 + 3).toFixed(1);
                const reviews = Math.floor(Math.random() * 1000 + 10);
                
                products.push({
                    id: i + 1,
                    title: `${brands[i % brands.length]} ${query} - ${['Pro', 'Plus', 'Elite', 'Max', 'Ultra'][i % 5]} Model`,
                    price: price,
                    originalPrice: price + Math.floor(Math.random() * 50 + 10),
                    rating: rating,
                    reviews: reviews,
                    store: stores[i % stores.length],
                    icon: icon,
                    savings: Math.floor(Math.random() * 30 + 5),
                    url: '#'
                });
            }

            // Sort by price
            return products.sort((a, b) => a.price - b.price);
        }

        // Display search results
        function displayResults(query, results) {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('resultsSection').style.display = 'block';

            // Update results header
            document.getElementById('resultsTitle').textContent = `Results for "${query}"`;
            document.getElementById('resultsCount').textContent = `Found ${results.length} products from multiple stores`;

            // Generate products HTML
            const productsGrid = document.getElementById('productsGrid');
            productsGrid.innerHTML = results.map(product => `
                <div class="product-card">
                    <div class="product-image">${product.icon}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                        $${product.price}
                        ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 1rem; margin-left: 10px;">$${product.originalPrice}</span>` : ''}
                        ${product.savings ? `<span class="demo-badge">${product.savings}% OFF</span>` : ''}
                    </div>
                    <div class="product-rating">
                        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                        <span>${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <div class="product-store">Available at ${product.store}</div>
                    <a href="${product.url}" class="product-link" onclick="trackClick('${product.title}')">
                        <i class="fas fa-external-link-alt"></i>
                        View Deal
                    </a>
                </div>
            `).join('');
        }

        // Track clicks for demo
        function trackClick(productName) {
            alert(`Demo: Would redirect to ${productName} purchase page`);
        }

        // Go back function
        function goBack() {
            document.getElementById('mainInterface').style.display = 'block';
            document.getElementById('resultsSection').style.display = 'none';
            document.getElementById('loading').style.display = 'none';
            document.querySelector('.back-button').style.display = 'none';
            voiceText.textContent = '';
            searchInput.value = '';
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            initializeSpeechRecognition();
        });

        // Add copyright footer
        window.addEventListener('load', function() {
            const footer = document.createElement('footer');
            footer.style.cssText = `
                background: rgba(0,0,0,0.1); 
                color: white; 
                text-align: center; 
                padding: 20px; 
                margin-top: 40px;
                font-size: 14px;
                opacity: 0.8;
            `;
            footer.innerHTML = '© 2025 Asadullah channa. All rights reserved. Built with ❤️ for developers.';
            document.body.appendChild(footer);
        });