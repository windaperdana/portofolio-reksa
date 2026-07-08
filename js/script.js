// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemDark ? 'dark' : 'light');
    
    // Apply the current theme
    function setTheme(theme) {
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeIcon.className = 'bi bi-moon-fill';
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
            themeIcon.className = 'bi bi-sun-fill';
            localStorage.setItem('theme', 'light');
        }
    }
    
    // Initialize theme
    setTheme(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Add a subtle animation to the toggle
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // CV Export Functionality
    const exportCVButton = document.getElementById('exportCV');
    
    if (exportCVButton) {
        exportCVButton.addEventListener('click', function() {
            exportToPDF();
        });
    }
    
    function syncCVTemplateWithWeb() {
        const cvTemplate = document.getElementById('cv-template');
        if (!cvTemplate) return;

        // 1. Sync Personal Info & Title
        const heroTitle = document.querySelector('.hero-title .text-gradient');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const cvName = cvTemplate.querySelector('.cv-personal-info h1');
        const cvTitle = cvTemplate.querySelector('.cv-personal-info .cv-title');
        
        if (heroTitle && cvName) cvName.textContent = heroTitle.textContent.trim();
        if (heroSubtitle && cvTitle) cvTitle.textContent = heroSubtitle.textContent.trim();

        // 2. Sync Contact Info
        const contactItems = document.querySelectorAll('#contact .contact-item');
        let email = '';
        let phone = '';
        let location = '';
        
        contactItems.forEach(item => {
            const h5 = item.querySelector('h5');
            const p = item.querySelector('p');
            if (h5 && p) {
                const type = h5.textContent.trim().toLowerCase();
                const value = p.textContent.trim();
                if (type.includes('email')) email = value;
                else if (type.includes('phone')) phone = value;
                else if (type.includes('location')) location = value;
            }
        });

        const cvEmail = cvTemplate.querySelector('.cv-contact-item i.bi-envelope + span');
        const cvPhone = cvTemplate.querySelector('.cv-contact-item i.bi-phone + span');
        const cvLocation = cvTemplate.querySelector('.cv-contact-item i.bi-geo-alt + span');
        
        if (email && cvEmail) cvEmail.textContent = email;
        if (phone && cvPhone) cvPhone.textContent = phone;
        if (location && cvLocation) cvLocation.textContent = location;

        // 3. Linkedin & Github
        const footerLinks = document.querySelectorAll('footer .social-link');
        let linkedin = '';
        let github = '';
        
        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes('linkedin.com')) {
                linkedin = href.replace(/^https?:\/\/(www\.)?/, '');
            } else if (href.includes('github.com')) {
                github = href.replace(/^https?:\/\/(www\.)?/, '');
            }
        });

        const cvLinkedin = cvTemplate.querySelector('.cv-contact-item i.bi-linkedin + span');
        const cvGithub = cvTemplate.querySelector('.cv-contact-item i.bi-github + span');
        if (linkedin && cvLinkedin) cvLinkedin.textContent = linkedin;
        if (github && cvGithub) cvGithub.textContent = github;

        // 4. Professional Summary
        const heroDesc = document.querySelector('.hero-description');
        const sections = cvTemplate.querySelectorAll('.cv-section');
        sections.forEach(sec => {
            const h2 = sec.querySelector('h2');
            if (h2 && h2.textContent.includes('Professional Summary')) {
                const p = sec.querySelector('p');
                if (p && heroDesc) p.textContent = heroDesc.textContent.trim();
            }
        });

        // 5. Technical Skills
        const skillCards = document.querySelectorAll('#skills .skill-card');
        const cvSkillsGrid = cvTemplate.querySelector('.cv-skills-grid');
        if (skillCards.length > 0 && cvSkillsGrid) {
            cvSkillsGrid.innerHTML = '';
            skillCards.forEach(card => {
                const titleEl = card.querySelector('h4');
                const tags = Array.from(card.querySelectorAll('.skill-tag')).map(t => t.textContent.trim());
                if (titleEl && tags.length > 0) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'cv-skill-category';
                    categoryDiv.innerHTML = `
                        <h3>${titleEl.textContent.trim()}</h3>
                        <p>${tags.join(', ')}</p>
                    `;
                    cvSkillsGrid.appendChild(categoryDiv);
                }
            });
        }

        // 6. Work Experience
        const experienceCards = document.querySelectorAll('#experience .experience-card');
        let cvExperienceSection = null;
        sections.forEach(sec => {
            const h2 = sec.querySelector('h2');
            if (h2 && h2.textContent.includes('Work Experience')) {
                cvExperienceSection = sec;
            }
        });

        if (experienceCards.length > 0 && cvExperienceSection) {
            const heading = cvExperienceSection.querySelector('h2');
            cvExperienceSection.innerHTML = '';
            if (heading) cvExperienceSection.appendChild(heading);

            experienceCards.forEach(card => {
                const dateRange = card.querySelector('.date-range') ? card.querySelector('.date-range').textContent.trim() : '';
                const position = card.querySelector('.position-title') ? card.querySelector('.position-title').textContent.trim() : '';
                const company = card.querySelector('.company-name') ? card.querySelector('.company-name').textContent.trim() : '';
                const description = card.querySelector('.experience-description') ? card.querySelector('.experience-description').textContent.trim() : '';
                
                const achievements = Array.from(card.querySelectorAll('.achievement-list li')).map(li => li.textContent.trim());
                const techTags = Array.from(card.querySelectorAll('.tech-stack .tech-tag')).map(t => t.textContent.trim());

                const expItem = document.createElement('div');
                expItem.className = 'cv-experience-item';
                
                let achievementsHtml = '';
                if (achievements.length > 0) {
                    achievementsHtml = `
                        <ul>
                            ${achievements.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    `;
                }

                let techHtml = '';
                if (techTags.length > 0) {
                    techHtml = `
                        <div class="cv-tech">Technologies: ${techTags.join(', ')}</div>
                    `;
                }

                expItem.innerHTML = `
                    <div class="cv-experience-header">
                        <h3>${position}</h3>
                        <span class="cv-date">${dateRange}</span>
                    </div>
                    <div class="cv-company">${company}</div>
                    <p>${description}</p>
                    ${achievementsHtml}
                    ${techHtml}
                `;
                cvExperienceSection.appendChild(expItem);
            });
        }

        // 7. Stats
        const statsElements = document.querySelectorAll('#about .stats-row .stat-item');
        const cvStatsSection = cvTemplate.querySelector('.cv-stats');
        if (statsElements.length > 0 && cvStatsSection) {
            cvStatsSection.innerHTML = '';
            statsElements.forEach(stat => {
                const num = stat.querySelector('.stat-number') ? stat.querySelector('.stat-number').textContent.trim() : '';
                const label = stat.querySelector('.stat-label') ? stat.querySelector('.stat-label').textContent.trim() : '';
                if (num && label) {
                    const cvStatItem = document.createElement('div');
                    cvStatItem.className = 'cv-stat-item';
                    cvStatItem.innerHTML = `
                        <strong>${num}</strong> ${label}
                    `;
                    cvStatsSection.appendChild(cvStatItem);
                }
            });
        }
    }

    function exportToPDF() {
        const button = document.getElementById('exportCV');
        const buttonText = button.innerHTML;
        
        // Show loading state
        button.classList.add('loading');
        button.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>Generating...';
        button.disabled = true;
        
        // Synchronize the template content with the web UI content first
        syncCVTemplateWithWeb();

        // Get the CV template
        const element = document.getElementById('cv-template');
        
        // Create an invisible wrapper container inside the viewport bounds
        // to prevent html2canvas from rendering a blank/clipped PDF due to offscreen rendering
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.top = '0';
        wrapper.style.left = '0';
        wrapper.style.width = '0';
        wrapper.style.height = '0';
        wrapper.style.overflow = 'hidden';
        wrapper.style.zIndex = '-9999';
        
        // Clone the element to avoid modifying the original
        const clonedElement = element.cloneNode(true);
        clonedElement.style.display = 'block';
        clonedElement.style.width = '210mm';
        
        // Append clone to wrapper, and wrapper to body
        wrapper.appendChild(clonedElement);
        document.body.appendChild(wrapper);
        
        // Configure html2pdf options
        const opt = {
            margin: [0.4, 0.4, 0.4, 0.4], // top, left, bottom, right (in inches)
            filename: 'I PUTU REKSA WINDA PERDANA - Resume.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                letterRendering: true,
                allowTaint: false
            },
            jsPDF: { 
                unit: 'in', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate PDF
        html2pdf().set(opt).from(clonedElement).save().then(function() {
            // Remove wrapper
            if (document.body.contains(wrapper)) {
                document.body.removeChild(wrapper);
            }
            
            // Reset button state
            button.classList.remove('loading');
            button.innerHTML = buttonText;
            button.disabled = false;
            
            // Show success notification
            showNotification('CV exported successfully as PDF!', 'success');
        }).catch(function(error) {
            console.error('PDF generation error:', error);
            
            // Remove wrapper
            if (document.body.contains(wrapper)) {
                document.body.removeChild(wrapper);
            }
            
            // Reset button state
            button.classList.remove('loading');
            button.innerHTML = buttonText;
            button.disabled = false;
            
            // Show error notification
            showNotification('Failed to export CV. Please try again.', 'error');
        });
    }
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', updateNavbar);
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Call once on load
    
    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTopButton);
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Typing animation for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const titles = [
        'Senior Full Stack Developer',
        'Database Specialist',
        'Backend Engineer'
    ];
    
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentTitle = titles[currentTitleIndex];
        
        if (isDeleting) {
            currentCharIndex--;
        } else {
            currentCharIndex++;
        }
        
        heroSubtitle.textContent = currentTitle.substring(0, currentCharIndex);
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            typeSpeed = 500; // Pause before typing new title
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
    
    // Skill progress animation
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        skillBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            const progressBar = bar.querySelector('.progress-bar');
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        });
    }
    
    // Form submission
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name') || document.getElementById('name').value;
            const email = formData.get('email') || document.getElementById('email').value;
            const subject = formData.get('subject') || document.getElementById('subject').value;
            const message = formData.get('message') || document.getElementById('message').value;
            
            // Simple form validation
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto hide
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button event
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });
    }
    
    function hideNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // Parallax effect for floating shapes
    const floatingShapes = document.querySelectorAll('.shape');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        floatingShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
        });
    }
    
    window.addEventListener('scroll', updateParallax);
    
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Skill card animation on hover
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 200;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counter animation for stats section
                if (entry.target.id === 'about') {
                    setTimeout(animateCounters, 500);
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Mouse cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: var(--gradient-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.opacity = '0.5';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Clickable elements cursor effect
    const clickableElements = document.querySelectorAll('a, button, .project-card, .skill-card');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.opacity = '0.3';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.opacity = '0.5';
        });
    });
    
    // Loading animation
    window.addEventListener('load', () => {
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('loaded');
            }, index * 100);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Press Escape to close any open modals or overlays
        if (e.key === 'Escape') {
            const notification = document.querySelector('.notification');
            if (notification) {
                hideNotification(notification);
            }
        }
        
        // Press Home to go to top
        if (e.key === 'Home') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Press End to go to bottom
        if (e.key === 'End') {
            e.preventDefault();
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    });
    
    // Performance optimization: Throttle scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Apply throttling to scroll events
    const throttledUpdateNavbar = throttle(updateNavbar, 10);
    const throttledUpdateActiveNavLink = throttle(updateActiveNavLink, 10);
    const throttledToggleBackToTop = throttle(toggleBackToTopButton, 10);
    const throttledUpdateParallax = throttle(updateParallax, 10);
    
    window.removeEventListener('scroll', updateNavbar);
    window.removeEventListener('scroll', updateActiveNavLink);
    window.removeEventListener('scroll', toggleBackToTopButton);
    window.removeEventListener('scroll', updateParallax);
    
    window.addEventListener('scroll', throttledUpdateNavbar);
    window.addEventListener('scroll', throttledUpdateActiveNavLink);
    window.addEventListener('scroll', throttledToggleBackToTop);
    window.addEventListener('scroll', throttledUpdateParallax);
    
    console.log('🚀 Portfolio website loaded successfully!');
    console.log(`🎨 Current theme: ${body.getAttribute('data-theme') || 'light'}`);
    
    // Add theme transition indicator
    function showThemeTransition() {
        const indicator = document.createElement('div');
        indicator.innerHTML = `<i class="bi bi-${body.getAttribute('data-theme') === 'dark' ? 'moon-fill' : 'sun-fill'}"></i>`;
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: var(--gradient-primary);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            z-index: 10000;
            transition: all 0.3s ease;
            box-shadow: var(--shadow-hover);
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
            indicator.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        setTimeout(() => {
            indicator.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }, 800);
    }
    
    // Update theme toggle to show transition
    const originalThemeToggle = themeToggle.onclick;
    themeToggle.addEventListener('click', function() {
        showThemeTransition();
    });
});
