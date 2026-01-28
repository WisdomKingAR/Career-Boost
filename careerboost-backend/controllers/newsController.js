const axios = require('axios');

const mockNews = [
    {
        id: "news1",
        title: "OpenAI Releases GPT-5 with Revolutionary Reasoning Capabilities",
        content: "OpenAI's latest model GPT-5 demonstrates unprecedented reasoning abilities...",
        description: "OpenAI's latest model GPT-5 demonstrates unprecedented reasoning abilities...",
        category: "AI",
        source: "TechCrunch",
        sourceUrl: "https://www.google.com/search?q=OpenAI+Releases+GPT-5+TechCrunch",
        imageUrl: null,
        publishedAt: new Date('2025-12-28'),
        createdAt: new Date()
    },
    {
        id: "news2",
        headline: "Major Security Breach at CloudServe Affects 2 Million Users",
        description: "CloudServe reported a data breach exposing user credentials. Security experts recommend immediate password changes. The breach was caused by an SQL injection vulnerability.",
        category: "Cybersecurity",
        source: "SecurityWeek",
        sourceUrl: "https://www.google.com/search?q=Major+Security+Breach+at+CloudServe+SecurityWeek",
        imageUrl: null,
        publishedAt: new Date('2025-12-27'),
        createdAt: new Date()
    },
    {
        id: "news3",
        headline: "Google Announces Gemini 2.0 Pro with Enhanced Multimodal Capabilities",
        description: "Google's Gemini 2.0 Pro can now process video, audio, and text simultaneously with 50% better accuracy. Available for developers via Google AI Studio.",
        category: "AI",
        source: "The Verge",
        sourceUrl: "https://www.google.com/search?q=Google+Announces+Gemini+2.0+Pro+The+Verge",
        imageUrl: null,
        publishedAt: new Date('2025-12-26'),
        createdAt: new Date()
    },
    {
        id: "news4",
        headline: "India Launches National Cybersecurity Framework 2025",
        description: "Government of India introduces comprehensive cybersecurity guidelines for enterprises. Mandatory compliance for all organizations handling citizen data by June 2025.",
        category: "Cybersecurity",
        source: "The Hindu",
        sourceUrl: "https://www.google.com/search?q=India+Launches+National+Cybersecurity+Framework+2025+The+Hindu",
        imageUrl: null,
        publishedAt: new Date('2025-12-25'),
        createdAt: new Date()
    },
    {
        id: "news5",
        headline: "AutoML Tools Democratizing Machine Learning for Beginners",
        description: "New AutoML platforms like H2O.ai and AutoKeras enable students to build ML models without extensive coding. Adoption in Indian universities growing rapidly.",
        category: "DataScience",
        source: "Analytics India Magazine",
        sourceUrl: "https://www.google.com/search?q=AutoML+Tools+Democratizing+Machine+Learning+for+Beginners",
        imageUrl: null,
        publishedAt: new Date('2025-12-24'),
        createdAt: new Date()
    },
    {
        id: "news6",
        headline: "Zero-Day Vulnerability Discovered in Popular Web Framework",
        description: "Critical vulnerability in Express.js version 4.x allows remote code execution. Developers urged to update to latest version immediately.",
        category: "Cybersecurity",
        source: "Dark Reading",
        sourceUrl: "https://www.google.com/search?q=Zero-Day+Vulnerability+Discovered+in+Popular+Web+Framework+Dark+Reading",
        imageUrl: null,
        publishedAt: new Date('2025-12-23'),
        createdAt: new Date()
    }
];

exports.getLatestNews = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const key = process.env.NEWSAPI_KEY;
        if (key) {
            const url = `https://newsapi.org/v2/top-headlines?country=in&category=technology&pageSize=${parseInt(limit)}`;
            const resp = await axios.get(url, { headers: { 'X-Api-Key': key } });
            const mapped = (resp.data.articles || []).map((a, idx) => ({
                id: `news_${idx}`,
                headline: a.title,
                description: a.description || '',
                category: 'AI',
                source: a.source?.name || 'Unknown',
                sourceUrl: a.url,
                imageUrl: a.urlToImage || null,
                publishedAt: new Date(a.publishedAt || Date.now()),
                createdAt: new Date()
            }));
            return res.json(mapped);
        }
        const news = mockNews.slice(0, parseInt(limit));
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

exports.getNewsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ['AI', 'Cybersecurity', 'DataScience'];
        if (process.env.NEWSAPI_KEY) {
            const url = `https://newsapi.org/v2/top-headlines?country=in&category=technology&pageSize=10`;
            const resp = await axios.get(url, { headers: { 'X-Api-Key': process.env.NEWSAPI_KEY } });
            const mapped = (resp.data.articles || []).map((a, idx) => ({
                id: `news_${idx}`,
                headline: a.title,
                description: a.description || '',
                category,
                source: a.source?.name || 'Unknown',
                sourceUrl: a.url,
                imageUrl: a.urlToImage || null,
                publishedAt: new Date(a.publishedAt || Date.now()),
                createdAt: new Date()
            }));
            return res.json(mapped);
        }
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        const news = mockNews.filter(n => n.category === category);
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news by category' });
    }
};

exports.searchNews = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Search query required' });
        }
        if (process.env.NEWSAPI_KEY) {
            const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&pageSize=10&sortBy=publishedAt&language=en`;
            const resp = await axios.get(url, { headers: { 'X-Api-Key': process.env.NEWSAPI_KEY } });
            const mapped = (resp.data.articles || []).map((a, idx) => ({
                id: `news_${idx}`,
                headline: a.title,
                description: a.description || '',
                category: 'AI',
                source: a.source?.name || 'Unknown',
                sourceUrl: a.url,
                imageUrl: a.urlToImage || null,
                publishedAt: new Date(a.publishedAt || Date.now()),
                createdAt: new Date()
            }));
            return res.json(mapped);
        }
        const news = mockNews.filter(n =>
            (n.title || '').toLowerCase().includes(q.toLowerCase()) ||
            (n.content || '').toLowerCase().includes(q.toLowerCase()) ||
            (n.description || '').toLowerCase().includes(q.toLowerCase())
        );
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};
