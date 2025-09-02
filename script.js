// Simple portfolio script for smooth scrolling and interactivity

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active state to navigation based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const scrollPos = window.scrollY + navHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call to set active state
    updateActiveNavLink();
    
    // Add scroll effect to navbar
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down & past hero
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add entrance animations for experience items
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
    
    // Observe experience items for animation
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
    
    // Observe skill categories for animation
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'all 0.6s ease';
        observer.observe(category);
    });

    // Hero toggle: Data Analyst vs Risk Analytics
    const blurb = document.getElementById('hero-blurb');
    const seg = document.getElementById('profile-toggle');
    const toggleButtons = document.querySelectorAll('.segmented-toggle .seg-item');
    const copy = {
        data: "I’m a senior data analyst with 6+ years across tech, crypto and e‑commerce. I turn complex data into dashboards, reports and clear insights that drive product and business decisions.",
        risk: "Risk analytics specialist focused on fraud prevention, trust & safety and risk metrics. I design rule engines, build scalable pipelines and dashboards, and partner with DS/Eng to reduce loss and improve customer safety."
    };
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected','false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected','true');
            const mode = btn.getAttribute('data-mode');
            blurb.textContent = copy[mode] || copy.data;
            seg.classList.toggle('mode-risk', mode === 'risk');
            seg.classList.toggle('mode-data', mode !== 'risk');
        });
    });
});

// Add CSS for active nav state
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: #2563eb;
        position: relative;
    }
    
    .nav-links a.active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        right: 0;
        height: 2px;
        background: #2563eb;
    }
    
    .navbar {
        transition: transform 0.3s ease;
    }
`;
document.head.appendChild(style);
