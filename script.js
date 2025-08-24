// Data for different roles
const roleData = {
    risk: {
        hero: {
            title: "Senior Risk Data Analyst - Fraud & Trust Safety Expert",
            description: "Singaporean data analyst with 6 years of experience transforming complex data into strategic insights across crypto, fintech, and e-commerce. Specialized in fraud analytics, user behavior analysis, and risk mitigation strategies.",
            stats: {
                stat1: { number: "6", label: "Years Experience" },
                stat2: { number: "3", label: "Major Crypto/Fintech Companies" },
                stat3: { number: "Risk", label: "Analytics Focus" }
            }
        },
        about: {
            subtitle: "Transforming complex data into strategic risk insights across crypto and fintech",
            description: [
                "With extensive experience at leading companies like Binance and Gojek, I specialize in fraud analytics, user behavior analysis, and building robust risk management systems that protect organizational value.",
                "My expertise spans statistical analysis, pipeline creation, and metrics design with a focus on trust & safety, fraud detection, and regulatory compliance in high-stakes financial environments."
            ],
            expertise: [
                { icon: "fas fa-shield-alt", text: "Fraud Analytics & Detection" },
                { icon: "fas fa-users", text: "User Behavior Analysis" },
                { icon: "fas fa-chart-line", text: "Risk Metrics Design" },
                { icon: "fas fa-database", text: "Data Pipeline Architecture" }
            ]
        },
        skills: {
            subtitle: "Advanced proficiency in risk analytics across crypto, fintech, and e-commerce",
            categories: [
                {
                    title: "Risk & Fraud Analytics",
                    icon: "fas fa-shield-alt",
                    skills: ["Fraud Detection Models", "User Behavior Analytics", "Trust & Safety Metrics", "Risk Scoring", "Anomaly Detection", "Transaction Monitoring"]
                },
                {
                    title: "Programming & Big Data",
                    icon: "fas fa-code",
                    skills: ["Python", "PySpark", "Spark SQL", "SQL", "R", "JavaScript", "HTML", "CSS"]
                },
                {
                    title: "Data Engineering",
                    icon: "fas fa-database",
                    skills: ["ETL Development", "Data Migration", "Pipeline Creation", "Statistical Reporting", "Data Architecture", "Process Optimization"]
                },
                {
                    title: "Analytics & Visualization",
                    icon: "fas fa-chart-bar",
                    skills: ["Tableau", "Statistical Analysis", "Dashboard Development", "Machine Learning", "Data Visualization", "KPI Design"]
                }
            ]
        },
        projects: {
            subtitle: "Risk management and fraud prevention solutions across leading fintech companies",
            projects: [
                {
                    title: "Fraud Analytics System at Binance",
                    category: "Fraud Detection",
                    description: "Developed comprehensive fraud detection models and user behavior analytics systems at the world's largest crypto exchange, focusing on transaction monitoring and risk scoring.",
                    metrics: [
                        { value: "2022-2024", label: "Duration" },
                        { value: "Crypto", label: "Industry" }
                    ],
                    tags: ["Python", "PySpark", "Fraud Analytics", "User Behavior", "Crypto"],
                    links: [
                        { type: "external", url: "https://linkedin.com/in/sofiakung", text: "LinkedIn Profile" }
                    ]
                },
                {
                    title: "Risk Data Analytics at Gojek",
                    category: "Risk Management",
                    description: "Built statistical analysis frameworks and reporting pipelines for Southeast Asia's leading super app, focusing on risk mitigation across multiple business verticals.",
                    metrics: [
                        { value: "2021-2022", label: "Duration" },
                        { value: "Super App", label: "Platform" }
                    ],
                    tags: ["Statistical Analysis", "Risk Analytics", "Pipeline Creation", "Reporting"],
                    links: [
                        { type: "external", url: "https://linkedin.com/in/sofiakung", text: "LinkedIn Profile" }
                    ]
                },
                {
                    title: "ETL & Data Migration at PwC",
                    category: "Data Engineering",
                    description: "Led ETL development and data migration projects for enterprise clients, ensuring data quality and regulatory compliance across financial services engagements.",
                    metrics: [
                        { value: "2019-2021", label: "Duration" },
                        { value: "Consulting", label: "Role" }
                    ],
                    tags: ["ETL", "Data Migration", "SQL", "Consulting", "Financial Services"],
                    links: [
                        { type: "external", url: "https://linkedin.com/in/sofiakung", text: "LinkedIn Profile" }
                    ]
                }
            ]
        }
    },
    data: {
        hero: {
            title: "Senior Data Analyst - Product & Business Intelligence Expert",
            description: "Singaporean data analyst with 6 years of experience across tech, crypto, consulting and e-commerce. Specialized in product analytics, business intelligence, and transforming data into actionable business insights.",
            stats: {
                stat1: { number: "6", label: "Years Experience" },
                stat2: { number: "6", label: "Companies Across Industries" },
                stat3: { number: "Product", label: "Analytics Focus" }
            }
        },
        about: {
            subtitle: "Transforming complex data into actionable business insights across multiple industries",
            description: [
                "With diverse experience spanning crypto (Binance), super apps (Gojek), fintech (Atome), consulting (PwC), education (Hackwagon), and e-commerce (Lazada), I bring a unique cross-industry perspective to data analysis.",
                "My expertise encompasses product funnel analysis, business intelligence, statistical modeling, and dashboard development with a proven track record of driving data-informed decision making across various business domains."
            ],
            expertise: [
                { icon: "fas fa-chart-line", text: "Product Analytics & Funnels" },
                { icon: "fas fa-tachometer-alt", text: "Business Intelligence" },
                { icon: "fas fa-eye", text: "Data Visualization" },
                { icon: "fas fa-graduation-cap", text: "Data Science Education" }
            ]
        },
        skills: {
            subtitle: "Comprehensive toolkit for product analytics and business intelligence",
            categories: [
                {
                    title: "Product Analytics",
                    icon: "fas fa-chart-line",
                    skills: ["Product Funnel Analysis", "Feature Performance", "A/B Testing", "User Journey Analytics", "Cohort Analysis", "Conversion Optimization"]
                },
                {
                    title: "Programming & Analytics",
                    icon: "fas fa-code",
                    skills: ["Python", "PySpark", "Spark SQL", "SQL", "R", "JavaScript", "HTML", "CSS"]
                },
                {
                    title: "Business Intelligence",
                    icon: "fas fa-tachometer-alt",
                    skills: ["Dashboard Development", "KPI Design", "Statistical Analysis", "Machine Learning", "Data Storytelling", "Strategic Planning"]
                },
                {
                    title: "Visualization & Tools",
                    icon: "fas fa-chart-bar",
                    skills: ["Tableau", "Data Visualization", "Reporting", "Process Optimization", "Project Management", "Teaching"]
                }
            ]
        },
        projects: {
            subtitle: "Data-driven solutions across crypto, fintech, consulting, and e-commerce",
            projects: [
                {
                    title: "Product Analytics at Atome",
                    category: "Product Intelligence",
                    description: "Conducted comprehensive product funnel analysis and feature performance evaluation for the buy-now-pay-later fintech platform, driving product optimization strategies.",
                    metrics: [
                        { value: "2021", label: "Duration" },
                        { value: "Fintech", label: "Industry" }
                    ],
                    tags: ["Product Analytics", "Funnel Analysis", "Feature Performance", "Fintech"],
                    links: [
                        { type: "external", url: "https://linkedin.com/in/sofiakung", text: "LinkedIn Profile" }
                    ]
                },
                {
                    title: "Data Science Education at Hackwagon",
                    category: "Education & Training",
                    description: "Served as Python Teaching Assistant, educating students in data visualization, manipulation, and machine learning techniques across multiple cohorts.",
                    metrics: [
                        { value: "2018-2021", label: "Duration" },
                        { value: "Teaching", label: "Role" }
                    ],
                    tags: ["Python", "Data Visualization", "Machine Learning", "Teaching", "Education"],
                    links: [
                        { type: "external", url: "https://linkedin.com/in/sofiakung", text: "LinkedIn Profile" }
                    ]
                },
                {
                    title: "E-commerce Analytics at Lazada",
                    category: "Business Intelligence",
                    description: "Built comprehensive dashboards for voucher and logistics data analysis at Southeast Asia's leading e-commerce platform, supporting strategic business decisions.",
                    metrics: [
                        { value: "2018", label: "Duration" },
                        { value: "E-commerce", label: "Platform" }
                    ],
                    tags: ["Dashboarding", "E-commerce Analytics", "Logistics", "Business Intelligence"],
                    links: [
                        { type: "external", url: "https://linkedin.com/in/sofiakung", text: "LinkedIn Profile" }
                    ]
                }
            ]
        }
    }
};

// DOM Elements
const roleToggle = document.getElementById('roleToggle');
const elements = {
    mainTitle: document.getElementById('mainTitle'),
    heroDescription: document.getElementById('heroDescription'),
    stat1: document.getElementById('stat1'),
    stat2: document.getElementById('stat2'),
    stat3: document.getElementById('stat3'),
    statLabel1: document.getElementById('statLabel1'),
    statLabel2: document.getElementById('statLabel2'),
    statLabel3: document.getElementById('statLabel3'),
    aboutSubtitle: document.getElementById('aboutSubtitle'),
    aboutDescription: document.getElementById('aboutDescription'),
    expertiseAreas: document.getElementById('expertiseAreas'),
    skillsSubtitle: document.getElementById('skillsSubtitle'),
    skillsGrid: document.getElementById('skillsGrid'),
    projectsSubtitle: document.getElementById('projectsSubtitle'),
    projectsGrid: document.getElementById('projectsGrid')
};

// Current role state
let currentRole = 'risk';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader
    setTimeout(() => {
        const loader = document.querySelector('.page-loader');
        loader.classList.add('hidden');
    }, 1500);

    // Initialize role content
    updateContent('risk');
    
    // Setup role toggle
    setupRoleToggle();
    
    // Setup navigation
    setupNavigation();
    
    // Setup form
    setupForm();
    
    // Setup animations
    setupAnimations();
    
    // Initialize radar chart
    initializeRadarChart();
});

// Role toggle functionality
function setupRoleToggle() {
    roleToggle.addEventListener('change', function() {
        const newRole = this.checked ? 'data' : 'risk';
        if (newRole !== currentRole) {
            currentRole = newRole;
            updateContent(newRole);
        }
    });
}

// Update content based on role
function updateContent(role) {
    const data = roleData[role];
    
    // Animate content change
    animateContentChange(() => {
        // Update hero section
        elements.mainTitle.textContent = data.hero.title;
        elements.heroDescription.textContent = data.hero.description;
        
        // Update stats
        elements.stat1.textContent = data.hero.stats.stat1.number;
        elements.stat2.textContent = data.hero.stats.stat2.number;
        elements.stat3.textContent = data.hero.stats.stat3.number;
        elements.statLabel1.textContent = data.hero.stats.stat1.label;
        elements.statLabel2.textContent = data.hero.stats.stat2.label;
        elements.statLabel3.textContent = data.hero.stats.stat3.label;
        
        // Update about section
        elements.aboutSubtitle.textContent = data.about.subtitle;
        
        // Update about description
        elements.aboutDescription.innerHTML = data.about.description
            .map(p => `<p>${p}</p>`)
            .join('');
        
        // Update expertise areas
        elements.expertiseAreas.innerHTML = data.about.expertise
            .map(item => `
                <div class="expertise-item">
                    <i class="${item.icon}"></i>
                    <span>${item.text}</span>
                </div>
            `).join('');
        
        // Update skills section
        elements.skillsSubtitle.textContent = data.skills.subtitle;
        elements.skillsGrid.innerHTML = data.skills.categories
            .map(category => `
                <div class="skill-category">
                    <h3><i class="${category.icon}"></i> ${category.title}</h3>
                    <div class="skill-list">
                        ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        
        // Update projects section
        elements.projectsSubtitle.textContent = data.projects.subtitle;
        elements.projectsGrid.innerHTML = data.projects.projects
            .map(project => `
                <div class="project-card">
                    <div class="project-header">
                        <h3 class="project-title">${project.title}</h3>
                        <span class="project-category">${project.category}</span>
                    </div>
                    <div class="project-content">
                        <p class="project-description">${project.description}</p>
                        <div class="project-metrics">
                            ${project.metrics.map(metric => `
                                <div class="project-metric">
                                    <span class="metric-value">${metric.value}</span>
                                    <span class="metric-label">${metric.label}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            ${project.links.map(link => `
                                <a href="${link.url}" class="project-link">
                                    <i class="fas fa-${link.type === 'github' ? 'code' : 'external-link-alt'}"></i>
                                    ${link.text}
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
    });
}

// Animate content change
function animateContentChange(updateCallback) {
    const sections = ['hero-content', 'about-content', 'skills-grid', 'projects-grid'];
    
    sections.forEach(sectionClass => {
        const element = document.querySelector(`.${sectionClass}`) || document.getElementById(sectionClass);
        if (element) {
            element.style.opacity = '0.5';
            element.style.transform = 'translateY(10px)';
        }
    });
    
    setTimeout(() => {
        updateCallback();
        
        sections.forEach(sectionClass => {
            const element = document.querySelector(`.${sectionClass}`) || document.getElementById(sectionClass);
            if (element) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                element.style.transition = 'all 0.3s ease';
            }
        });
    }, 150);
}

// Navigation setup
function setupNavigation() {
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
}

// Form setup
function setupForm() {
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show success message (in a real app, you'd send this to a server)
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Setup animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.skill-category, .project-card, .expertise-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize radar chart
function initializeRadarChart() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    
    // Skills data (normalized to 0-1)
    const skills = {
        risk: [
            { label: 'Risk Modeling', value: 0.9 },
            { label: 'Statistics', value: 0.85 },
            { label: 'Programming', value: 0.8 },
            { label: 'Regulation', value: 0.9 },
            { label: 'Analytics', value: 0.85 },
            { label: 'Communication', value: 0.8 }
        ],
        data: [
            { label: 'Analysis', value: 0.9 },
            { label: 'Programming', value: 0.85 },
            { label: 'ML/AI', value: 0.8 },
            { label: 'Visualization', value: 0.9 },
            { label: 'Statistics', value: 0.85 },
            { label: 'Communication', value: 0.8 }
        ]
    };
    
    function drawRadarChart(skillsData) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Draw concentric circles
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * (i / 5), 0, 2 * Math.PI);
            ctx.stroke();
        }
        
        // Draw axis lines
        const angleStep = (2 * Math.PI) / skillsData.length;
        skillsData.forEach((_, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Draw labels
            ctx.fillStyle = '#6b7280';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            ctx.fillText(skillsData[index].label, labelX, labelY);
        });
        
        // Draw skill polygon
        ctx.beginPath();
        skillsData.forEach((skill, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const distance = skill.value * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.closePath();
        
        // Fill and stroke the polygon
        ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
        ctx.fill();
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#6366f1';
        skillsData.forEach((skill, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const distance = skill.value * radius;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    // Initial draw
    drawRadarChart(skills[currentRole]);
    
    // Update radar chart when role changes
    const originalUpdateContent = updateContent;
    updateContent = function(role) {
        originalUpdateContent(role);
        setTimeout(() => {
            drawRadarChart(skills[role]);
        }, 200);
    };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-links.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        padding: 1rem 2rem;
        border-bottom: 1px solid var(--border-light);
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
    }
`;
document.head.appendChild(style);