# Data Professional Portfolio Website

A modern, interactive portfolio website with a unique role toggle feature that allows visitors to switch between "Risk Analyst" and "Data Analyst" views. Built with vanilla HTML, CSS, and JavaScript for optimal performance and compatibility.

## Features

### Core Functionality
- **Role Toggle System**: Dynamic switch between Risk Analyst and Data Analyst personas
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Animations**: Smooth transitions and engaging visual effects
- **Skills Radar Chart**: Dynamic visualization that updates based on selected role
- **Modern UI**: Clean, professional design inspired by industry leaders

### Role-Specific Content
- **Different Hero Sections**: Tailored taglines, descriptions, and statistics
- **Dynamic Skills Display**: Role-appropriate technical competencies
- **Customized Project Portfolios**: Relevant work samples for each role
- **Adaptive About Section**: Personalized expertise areas and descriptions

### Technical Features
- **Vanilla JavaScript**: No framework dependencies for fast loading
- **CSS Animations**: Smooth transitions and interactive elements
- **Mobile Navigation**: Responsive hamburger menu for mobile devices
- **Contact Form**: Interactive form with validation
- **Loading Animation**: Professional page loader with branding

## File Structure

```
portfolio-website/
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS styling and animations
├── script.js           # JavaScript functionality and role toggle logic
└── README.md           # Project documentation
```

## Getting Started

1. Clone or download the project files
2. Open `index.html` in your web browser
3. Toggle between roles using the switch in the hero section
4. Navigate through different sections to see dynamic content changes

## Customization

### Adding New Roles
To add additional roles, modify the `roleData` object in `script.js`:

```javascript
const roleData = {
    yourNewRole: {
        hero: { /* hero content */ },
        about: { /* about content */ },
        skills: { /* skills content */ },
        projects: { /* projects content */ }
    }
};
```

### Styling Changes
All visual styling is contained in `styles.css`. Key customization areas:
- CSS custom properties (variables) at the top for colors and themes
- Section-specific styling for layout modifications
- Responsive breakpoints for mobile optimization

### Content Updates
Update personal information, projects, and skills directly in the `roleData` object within `script.js`.

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Performance

- Pure vanilla JavaScript for minimal overhead
- Optimized CSS with efficient selectors
- Lazy loading of animations for smooth performance
- Mobile-first responsive design

## Deployment

Simply upload all files to your web hosting provider or use services like:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

The website is completely self-contained with no external dependencies (except for Google Fonts and Font Awesome CDN).