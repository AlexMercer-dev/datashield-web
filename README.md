# DataShield - Privacy-Focused Browser Extension

## About DataShield

DataShield is a powerful browser extension designed to protect your online privacy by blocking trackers, managing cookies, and providing detailed privacy reports. Our mission is to make advanced privacy protection accessible to everyone, regardless of technical expertise.

### Features

- Advanced Tracker Blocking: Automatically blocks third-party trackers, fingerprinting techniques, and invisible pixels
- Intelligent Cookie Management: Control which cookies are stored and for how long
- Comprehensive Privacy Reports: Get detailed insights into your online privacy status
- Privacy Score: Understand and improve your privacy protection with our unique scoring system
- Lightweight & Fast: Minimal impact on browsing performance

## Project Website

This repository contains the promotional website for the DataShield browser extension. The website is built with:

- Flask (Python web framework)
- Bootstrap 5 (Frontend framework)
- Docker (Containerization)

## Development Setup

### Prerequisites

- Docker and Docker Compose
- Git
- Python 3.8+

### Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/datashield-web.git
```

2. Build and start the containers:

```
docker-compose up -d
```

### Manual Setup (without Docker)

If you prefer to run the application without Docker:

1. Create a virtual environment:
```
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Run the application:
```
python app.py
```

## Project Structure

```
datashield_promo/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── static/                # Static assets
│   ├── css/               # CSS files
│   │   └── style.css      # Main stylesheet
│   └── js/                # JavaScript files
│       └── script.js      # Main JavaScript file
└── templates/             # HTML templates
    ├── base.html          # Base template (header, footer)
    ├── index.html         # Home page
    ├── features.html      # Features page
    └── ...                # Other page templates
```

## Analytics Implementation

DataShield's website uses a privacy-focused analytics system that:

- Respects user privacy by anonymizing data
- Uses local storage for session tracking instead of cookies where possible
- Tracks only essential data to improve user experience
- Provides users with transparency about what is tracked

## Security Considerations

- All form submissions are protected with CSRF tokens
- User data is never stored on our servers
- The website uses HTTPS for secure communication
- Regular security audits are performed to ensure data protection

## Contributing

We welcome contributions to improve the DataShield promotional website! Please feel free to submit issues or pull requests.

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team

- Alex Mercer - Lead Developer
- Sarah Johnson - Co-Founder & CEO
- Michael Chen - UX/UI Designer
- Emma Wilson - Privacy Researcher

## License

This project is licensed under the MIT License - see the LICENSE file for details.

U0stQ0VSVHtoMWRkM25fMW5fcGw0MW5fczFnaHR9