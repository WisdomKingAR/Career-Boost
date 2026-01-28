const bcrypt = require('bcryptjs');

// Pre-hashed password 'password'
const hashedPassword = bcrypt.hashSync('password', 10);

const users = [
    {
        id: "user1",
        email: "testuser@example.com",
        username: "testuser",
        password: bcrypt.hashSync('ValidPass123!', 10),
        name: "Test User",
        location: "Mumbai, India",
        createdAt: new Date(),
        skills: [],
        preferences: {
            id: "p1",
            roles: ["Frontend Developer", "AI Engineer"],
            locations: ["Mumbai", "Remote"],
            salary: 50000
        }
    },
    {
        id: "user_test",
        name: "Valid User",
        email: "validuser@example.com",
        password: bcrypt.hashSync('ValidPass123!', 10),
        username: "validuser",
        location: "New York, USA",
        skills: [],
        createdAt: new Date()
    }
];

const certificates = [
    {
        id: "cert1",
        name: "Google Data Analytics Professional Certificate",
        issuer: "Google",
        level: "Beginner",
        description: "Learn the foundations of data analytics...",
        duration: 240,
        cost: 0,
        skills: ["Data Analysis", "R Programming", "Tableau"],
        url: "https://coursera.org",
        salaryImpact: "+20% Salary Bump",
        deadline: null
    },
    {
        id: "cert2",
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        level: "Advanced",
        description: "Validate your expertise in designing distributed systems on AWS.",
        duration: 120,
        cost: 150,
        skills: ["Cloud Computing", "AWS", "System Design"],
        url: "https://aws.amazon.com",
        salaryImpact: "High Demand",
        deadline: null
    },
    {
        id: "cert3",
        name: "Google AI Essentials",
        issuer: "Google",
        url: "https://www.coursera.org/learn/google-ai-essentials",
        duration: 10,
        cost: 0,
        level: "Beginner",
        skills: ["AI Fundamentals", "Machine Learning Basics", "Generative AI"],
        salaryImpact: "10-15% increase for entry-level AI roles",
        description: "Learn AI fundamentals from Google experts. Perfect for beginners looking to understand AI and its applications.",
        deadline: new Date('2025-12-31')
    },
    {
        id: "cert4",
        name: "IBM Data Science Professional Certificate",
        issuer: "IBM",
        url: "https://www.coursera.org/professional-certificates/ibm-data-science",
        duration: 120,
        cost: 0,
        level: "Intermediate",
        skills: ["Python", "Data Analysis", "Machine Learning", "SQL", "Data Visualization"],
        salaryImpact: "20-30% increase for data science roles",
        description: "Complete data science program covering Python, SQL, ML, and real-world projects.",
        deadline: null
    },
    {
        id: "cert5",
        name: "Microsoft Azure AI Fundamentals",
        issuer: "Microsoft",
        url: "https://learn.microsoft.com/en-us/certifications/azure-ai-fundamentals/",
        duration: 25,
        cost: 99,
        level: "Beginner",
        skills: ["Azure", "AI Services", "Machine Learning", "Computer Vision"],
        salaryImpact: "12-18% increase",
        description: "Learn AI concepts and Azure AI services for building intelligent applications.",
        deadline: null
    },
    {
        id: "cert6",
        name: "Deep Learning Specialization",
        issuer: "DeepLearning.AI",
        url: "https://www.coursera.org/specializations/deep-learning",
        duration: 80,
        cost: 49,
        level: "Advanced",
        skills: ["Neural Networks", "Deep Learning", "TensorFlow", "CNN", "RNN"],
        salaryImpact: "30-40% increase for ML engineers",
        description: "Andrew Ng's comprehensive deep learning course covering neural networks and modern architectures.",
        deadline: null
    },
    {
        id: "cert7",
        name: "NPTEL - Introduction to Machine Learning",
        issuer: "IIT Madras via NPTEL",
        url: "https://nptel.ac.in/courses/106106139",
        duration: 60,
        cost: 0,
        level: "Intermediate",
        skills: ["Machine Learning", "Python", "Algorithms", "Mathematics"],
        salaryImpact: "15-25% increase",
        description: "Free Indian course from IIT Madras covering ML fundamentals with Indian context.",
        deadline: new Date('2025-06-30')
    },
    {
        id: "cert8",
        name: "Google Cybersecurity Professional Certificate",
        issuer: "Google",
        url: "https://www.coursera.org/google-certificates/cybersecurity-certificate",
        duration: 100,
        cost: 0,
        level: "Beginner",
        skills: ["Cybersecurity", "Network Security", "Linux", "Python", "Security Tools"],
        salaryImpact: "25-35% increase for security roles",
        description: "Job-ready cybersecurity program designed by Google with hands-on projects.",
        deadline: null
    },
    {
        id: "cert9",
        name: "TensorFlow Developer Certificate",
        issuer: "TensorFlow",
        url: "https://www.tensorflow.org/certificate",
        duration: 60,
        cost: 100,
        level: "Advanced",
        skills: ["TensorFlow", "Deep Learning", "Neural Networks", "Computer Vision", "NLP"],
        salaryImpact: "30-45% increase",
        description: "Official TensorFlow certification demonstrating ML engineering proficiency.",
        deadline: null
    }
];

const internships = [
    {
        id: "int1",
        title: "AI Research Intern",
        company: "OpenAI",
        remote: true,
        description: "Work on cutting-edge LLMs.",
        location: "San Francisco, USA",
        duration: 3,
        stipend: 100000,
        skills: ["Python", "PyTorch", "Deep Learning"],
        applicationUrl: "https://openai.com/careers",
        deadline: new Date('2026-03-01')
    },
    {
        id: "int2",
        title: "Frontend Developer Intern",
        company: "Swiggy",
        remote: false,
        description: "Build delightful food delivery experiences.",
        location: "Bangalore, India",
        duration: 6,
        stipend: 30000,
        skills: ["React", "JavaScript", "CSS"],
        applicationUrl: "https://careers.swiggy.com",
        deadline: new Date('2026-01-15')
    },
    {
        id: "int3",
        title: "AI/ML Intern",
        company: "Google India",
        location: "Bangalore, India",
        remote: true,
        duration: 6,
        stipend: 80000,
        skills: ["Python", "Machine Learning", "TensorFlow", "Data Analysis"],
        deadline: new Date('2025-03-15'),
        applicationUrl: "https://careers.google.com/jobs",
        description: "Work on cutting-edge AI projects with Google's AI team. Build ML models for production systems.",
        createdAt: new Date()
    },
    {
        id: "int4",
        title: "Data Science Intern",
        company: "Microsoft",
        location: "Hyderabad, India",
        remote: false,
        duration: 3,
        stipend: 50000,
        skills: ["Python", "SQL", "Data Visualization", "Statistics"],
        deadline: new Date('2025-02-28'),
        applicationUrl: "https://careers.microsoft.com",
        description: "Join Microsoft's data team to analyze large datasets and build predictive models.",
        createdAt: new Date()
    },
    {
        id: "int5",
        title: "Cybersecurity Intern",
        company: "Tata Consultancy Services",
        location: "Mumbai, India",
        remote: false,
        duration: 4,
        stipend: 25000,
        skills: ["Network Security", "Ethical Hacking", "Linux", "Security Tools"],
        deadline: new Date('2025-04-30'),
        applicationUrl: "https://www.tcs.com/careers",
        description: "Learn enterprise security practices and work on real-world security assessments.",
        createdAt: new Date()
    },
    {
        id: "int6",
        title: "Full Stack AI Developer Intern",
        company: "Hugging Face",
        location: "Remote",
        remote: true,
        duration: 6,
        stipend: 60000,
        skills: ["JavaScript", "Python", "React", "NLP", "Transformers"],
        deadline: new Date('2025-03-30'),
        applicationUrl: "https://huggingface.co/jobs",
        description: "Build AI-powered applications using Hugging Face transformers and modern web technologies.",
        createdAt: new Date()
    },
    {
        id: "int7",
        title: "AI Research Intern",
        company: "IIT Bombay - AI Lab",
        location: "Mumbai, India",
        remote: false,
        duration: 6,
        stipend: 15000,
        skills: ["Deep Learning", "Research", "Python", "Mathematics"],
        deadline: new Date('2025-05-15'),
        applicationUrl: "https://www.iitb.ac.in/",
        description: "Contribute to cutting-edge AI research projects at India's premier institute.",
        createdAt: new Date()
    }
];

const hackathons = [
    {
        id: "hack1",
        name: "Smart India Hackathon 2026",
        platform: "Government of India",
        remote: false,
        description: "Solve real-world problems faced by ministries.",
        startDate: new Date('2026-08-01'),
        endDate: new Date('2026-08-03'),
        prizePool: 500000,
        teamSize: "6 Members",
        skills: ["Innovation", "Full Stack", "IoT"],
        registerUrl: "https://sih.gov.in",
        location: "Multiple Nodes"
    },
    {
        id: "hack2",
        name: "Google AI Hackathon 2025",
        platform: "DevPost",
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-02-15'),
        prizePool: 500000,
        location: "Online",
        remote: true,
        teamSize: "1-4",
        skills: ["AI", "Machine Learning", "Python", "TensorFlow"],
        registerUrl: "https://devpost.com/hackathons",
        description: "Build innovative AI solutions using Google Cloud AI services. Cash prizes for top 10 teams.",
        createdAt: new Date()
    },
    {
        id: "hack3",
        name: "HackerEarth Deep Learning Sprint",
        platform: "HackerEarth",
        startDate: new Date('2025-01-20'),
        endDate: new Date('2025-02-20'),
        prizePool: 100000,
        location: "Online",
        remote: true,
        teamSize: "1-3",
        skills: ["Deep Learning", "Computer Vision", "PyTorch"],
        registerUrl: "https://www.hackerearth.com/challenges/",
        description: "Month-long deep learning competition focusing on computer vision challenges.",
        createdAt: new Date()
    },
    {
        id: "hack4",
        name: "Kaggle - Cybersecurity Challenge",
        platform: "Kaggle",
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-04-10'),
        prizePool: 750000,
        location: "Online",
        remote: true,
        teamSize: "1-5",
        skills: ["Cybersecurity", "Data Analysis", "ML"],
        registerUrl: "https://www.kaggle.com/competitions",
        description: "Detect and classify cyber threats using machine learning techniques.",
        createdAt: new Date()
    }
];

const tools = [
    {
        id: "tool1",
        name: "ChatGPT",
        category: "Generative AI",
        difficulty: "Beginner",
        description: "AI chatbot for conversational assistance.",
        freeTier: true,
        features: ["Text Generation", "Coding Help"],
        pricing: "$20/mo for Plus",
        url: "https://chat.openai.com",
        documentation: "https://platform.openai.com/docs"
    },
    {
        id: "tool2",
        name: "Google Colab",
        category: "Development",
        description: "Free cloud-based Jupyter notebook environment with GPU support. Perfect for running ML experiments without local setup.",
        url: "https://colab.research.google.com/",
        documentation: "https://colab.research.google.com/notebooks/intro.ipynb",
        difficulty: "beginner",
        pricing: "Free with paid Pro option ($9.99/mo)",
        freeTier: true,
        features: ["Free GPU/TPU", "No setup required", "Easy sharing", "GitHub integration"],
        createdAt: new Date()
    },
    {
        id: "tool3",
        name: "Hugging Face",
        category: "AI Models",
        description: "Platform for pre-trained AI models, datasets, and ML demos. Contains 100,000+ models for NLP, computer vision, and more.",
        url: "https://huggingface.co/",
        documentation: "https://huggingface.co/docs",
        difficulty: "intermediate",
        pricing: "Free with Pro features",
        freeTier: true,
        features: ["Pre-trained models", "Model hosting", "Datasets", "Inference API"],
        createdAt: new Date()
    },
    {
        id: "tool4",
        name: "Kaggle",
        category: "Data Science",
        description: "Community platform for data science competitions, datasets, and notebooks. Free GPU/TPU access for learning.",
        url: "https://www.kaggle.com/",
        documentation: "https://www.kaggle.com/docs",
        difficulty: "beginner",
        pricing: "Free",
        freeTier: true,
        features: ["Competitions", "Free datasets", "Learning courses", "Community notebooks"],
        createdAt: new Date()
    },
    {
        id: "tool5",
        name: "TensorFlow",
        category: "ML Framework",
        description: "Open-source machine learning framework by Google. Industry standard for deep learning projects.",
        url: "https://www.tensorflow.org/",
        documentation: "https://www.tensorflow.org/tutorials",
        difficulty: "intermediate",
        pricing: "Free",
        freeTier: true,
        features: ["Deep learning", "Production deployment", "Mobile ML", "Extensive tutorials"],
        createdAt: new Date()
    },
    {
        id: "tool6",
        name: "Weights & Biases",
        category: "ML Ops",
        description: "Experiment tracking and model management for ML projects. Visualize training metrics and collaborate with team.",
        url: "https://wandb.ai/",
        documentation: "https://docs.wandb.ai/",
        difficulty: "intermediate",
        pricing: "Free for individuals",
        freeTier: true,
        features: ["Experiment tracking", "Model versioning", "Collaboration", "Hyperparameter tuning"],
        createdAt: new Date()
    },
    {
        id: "tool7",
        name: "Replicate",
        category: "AI Deployment",
        description: "Run AI models with simple API calls. No infrastructure management needed.",
        url: "https://replicate.com/",
        documentation: "https://replicate.com/docs",
        difficulty: "beginner",
        pricing: "Pay-per-use",
        freeTier: true,
        features: ["One-line API", "Pre-built models", "Custom model hosting", "Easy deployment"],
        createdAt: new Date()
    }
];

const projects = [
    {
        id: "proj1",
        title: "AI-Powered Resume Screen",
        difficulty: "Intermediate",
        description: "Build a tool to parse and score resumes against job descriptions.",
        duration: 4,
        techStack: ["Python", "NLP", "React"],
        skills: ["Natural Language Processing", "API Integration"],
        steps: ["Setup Environment", "Build Parser", "Create UI"]
    },
    {
        id: "proj2",
        title: "AI-Powered Resume Analyzer",
        description: "Build a web app that analyzes resumes using NLP and provides improvement suggestions. Perfect for beginners learning AI + web dev.",
        difficulty: "beginner",
        duration: 2,
        techStack: ["Python", "Flask", "HTML/CSS", "spaCy", "NLTK"],
        skills: ["NLP", "Web Development", "Python", "API Design"],
        steps: [
            "Set up Flask web server",
            "Build resume upload interface",
            "Implement text extraction from PDF",
            "Use NLP to analyze keywords and structure",
            "Generate improvement suggestions",
            "Deploy to Heroku or Render"
        ],
        resources: [
            "spaCy documentation",
            "Flask tutorial",
            "PyPDF2 for PDF parsing"
        ],
        createdAt: new Date()
    },
    {
        id: "proj3",
        title: "Real-Time Cybersecurity Dashboard",
        description: "Create a dashboard that monitors network traffic and detects anomalies using machine learning.",
        difficulty: "intermediate",
        duration: 4,
        techStack: ["Python", "Scikit-learn", "React", "Node.js", "Socket.io"],
        skills: ["Cybersecurity", "Machine Learning", "Real-time Data", "Web Development"],
        steps: [
            "Collect network traffic data",
            "Train anomaly detection model",
            "Build backend API with Node.js",
            "Create React dashboard with real-time updates",
            "Implement alert system",
            "Add data visualization"
        ],
        resources: [
            "Scikit-learn anomaly detection",
            "Socket.io docs",
            "Wireshark for traffic analysis"
        ],
        createdAt: new Date()
    },
    {
        id: "proj4",
        title: "AI Chatbot for Career Guidance",
        description: "Build an intelligent chatbot that helps students discover career opportunities using LLMs.",
        difficulty: "intermediate",
        duration: 3,
        techStack: ["Python", "OpenAI API", "Streamlit", "LangChain"],
        skills: ["LLMs", "Prompt Engineering", "API Integration", "Python"],
        steps: [
            "Set up OpenAI API credentials",
            "Design conversation flow",
            "Implement LangChain for context management",
            "Build Streamlit interface",
            "Add career database integration",
            "Deploy to Streamlit Cloud"
        ],
        resources: [
            "OpenAI API docs",
            "LangChain tutorials",
            "Streamlit documentation"
        ],
        createdAt: new Date()
    },
    {
        id: "proj5",
        title: "Image Classification App for Indian Food",
        description: "Train a CNN to classify common Indian dishes. Great portfolio project showcasing deep learning skills.",
        difficulty: "beginner",
        duration: 2,
        techStack: ["Python", "TensorFlow", "Keras", "Streamlit"],
        skills: ["Deep Learning", "Computer Vision", "Transfer Learning"],
        steps: [
            "Collect/download Indian food dataset",
            "Use transfer learning with MobileNet",
            "Train and evaluate model",
            "Build Streamlit app for image upload",
            "Add prediction confidence scores",
            "Deploy to Streamlit Cloud"
        ],
        resources: [
            "TensorFlow tutorials",
            "Kaggle food datasets",
            "Transfer learning guide"
        ],
        createdAt: new Date()
    },
    {
        id: "proj6",
        title: "Cryptocurrency Price Predictor",
        description: "Use time series analysis and LSTM to predict crypto prices. Learn about financial ML.",
        difficulty: "advanced",
        duration: 6,
        techStack: ["Python", "PyTorch", "Pandas", "yfinance", "Plotly"],
        skills: ["Time Series", "LSTM", "Data Analysis", "Financial ML"],
        steps: [
            "Fetch historical crypto data",
            "Perform exploratory data analysis",
            "Build LSTM neural network",
            "Train with proper train/test split",
            "Evaluate prediction accuracy",
            "Create interactive dashboard",
            "Add backtesting functionality"
        ],
        resources: [
            "PyTorch LSTM tutorial",
            "yfinance documentation",
            "Time series forecasting guide"
        ],
        createdAt: new Date()
    }
];

const savedItems = [];
const applications = [];

module.exports = {
    users,
    certificates,
    internships,
    hackathons,
    tools,
    projects,
    savedItems,
    applications
};
