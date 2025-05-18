document.addEventListener('DOMContentLoaded', function() {
    // Accordion functionality for FAQ section
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current accordion item
            item.classList.toggle('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Video play button functionality
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        videoContainer.addEventListener('click', function() {
            // In a real implementation, this would replace the image with an actual video player
            alert('Video player would start here in a real implementation.');
        });
    }
    
    // Testimonial slider functionality
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    const totalSlides = testimonials.length;
    
    if (totalSlides > 0) {
        // Auto-scroll testimonials every 5 seconds
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateTestimonialSlider();
        }, 5000);
    }
    
    function updateTestimonialSlider() {
        const slider = document.querySelector('.testimonial-slider');
        if (slider) {
            const slideWidth = testimonials[0].offsetWidth + 30; // width + gap
            slider.scrollTo({
                left: currentSlide * slideWidth,
                behavior: 'smooth'
            });
        }
    }
    
    // Sticky header effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Mobile menu toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.classList.add('mobile-menu-toggle');
    mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
    
    const nav = document.querySelector('nav');
    const headerContainer = document.querySelector('header .container');
    
    if (window.innerWidth <= 768) {
        headerContainer.insertBefore(mobileMenuButton, nav);
        nav.classList.add('mobile-hidden');
        
        mobileMenuButton.addEventListener('click', () => {
            nav.classList.toggle('mobile-hidden');
            mobileMenuButton.classList.toggle('active');
            
            if (mobileMenuButton.classList.contains('active')) {
                mobileMenuButton.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
    
    // Window resize handler
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                headerContainer.insertBefore(mobileMenuButton, nav);
                nav.classList.add('mobile-hidden');
            }
        } else {
            if (document.querySelector('.mobile-menu-toggle')) {
                document.querySelector('.mobile-menu-toggle').remove();
                nav.classList.remove('mobile-hidden');
            }
        }
    });
    
    // Add additional CSS for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--dark-color);
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block;
            }
            
            nav.mobile-hidden ul {
                display: none;
            }
            
            nav ul {
                flex-direction: column;
                width: 100%;
                text-align: center;
            }
            
            nav ul li {
                margin: 10px 0;
            }
            
            header.sticky {
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add active class to current nav item
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentLocation) {
            link.classList.add('active');
        }
    });
    
    // Handle premium link click for analytics tracking
    const premiumLink = document.querySelector('.nav-link.text-primary');
    if (premiumLink) {
        premiumLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if analytics is available
            if (window.analytics) {
                window.analytics.trackEvent('navigation', 'premium_click', 'premium_page');
            }
            
            // Display a modal or alert for now (in real implementation would navigate to premium page)
            alert('Premium features coming soon! Subscribe for early access.');
        });
    }
    
    // Handle banner dismissal tracking
    const banner = document.querySelector('.alert-dismissible .btn-close');
    if (banner) {
        banner.addEventListener('click', function() {
            if (window.analytics) {
                window.analytics.trackEvent('interaction', 'banner_dismissed', 'promo_banner');
            }
        });
    }
}); 