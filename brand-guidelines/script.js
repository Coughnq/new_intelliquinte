document.addEventListener('DOMContentLoaded', function() {
    // Initialize section animations
    initializeSectionAnimations();
    
    // Add progress indicator
    addProgressIndicator();
    
    // Add back to top button
    addBackToTopButton();
    
    // Set up color swatch interactions
    setupColorSwatches();
    
    // Add keyboard navigation
    setupKeyboardNavigation();
});

// Add section indices for staggered animations
function initializeSectionAnimations() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.setProperty('--section-index', index);
    });
}

// Add a progress indicator at the top of the page
function addProgressIndicator() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    
    // Update progress bar width on scroll
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Add back to top button
function addBackToTopButton() {
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(backToTopButton);
    
    // Show button when scrolled down
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Set up color swatch interactions
function setupColorSwatches() {
    const colorSwatches = document.querySelectorAll('.color-swatch');
    
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const colorValue = e.currentTarget.nextElementSibling.nextElementSibling.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(colorValue)
                .then(() => {
                    // Create and display a toast notification
                    showToast(`Copied ${colorValue} to clipboard`);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        });
    });
}

// Show a toast notification
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
        
        // Add styles if they don't exist
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                .toast-notification {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: var(--color-text);
                    color: var(--color-cream);
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-size: 14px;
                    z-index: 1000;
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
                }
                .toast-notification.visible {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                .toast-notification.hiding {
                    opacity: 0;
                    transform: translateX(-50%) translateY(10px);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('visible');
    toast.classList.remove('hiding');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('hiding');
        toast.classList.remove('visible');
    }, 3000);
}

// Add active state to navigation based on scroll position
function updateActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-container a');
    const sections = document.querySelectorAll('section');
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 150; // Add offset to trigger earlier
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
        }
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Esc key
        if (e.key === 'Escape') {
            const activeElements = document.querySelectorAll('.active');
            activeElements.forEach(el => {
                if (el.classList.contains('active') && !el.classList.contains('tab-content') && !el.classList.contains('tab-nav-item')) {
                    el.classList.remove('active');
                }
            });
        }
        
        // Down arrow + Alt for section navigation
        if (e.key === 'ArrowDown' && e.altKey) {
            e.preventDefault();
            navigateToNextSection(1);
        }
        
        // Up arrow + Alt for section navigation
        if (e.key === 'ArrowUp' && e.altKey) {
            e.preventDefault();
            navigateToNextSection(-1);
        }
    });
}

// Navigate to the next or previous section
function navigateToNextSection(direction) {
    const sections = Array.from(document.querySelectorAll('section'));
    const scrollPosition = window.scrollY + 150;
    
    let currentSectionIndex = sections.findIndex(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.clientHeight;
        return scrollPosition >= sectionTop && scrollPosition < sectionBottom;
    });
    
    if (currentSectionIndex !== -1) {
        const nextIndex = currentSectionIndex + direction;
        if (nextIndex >= 0 && nextIndex < sections.length) {
            sections[nextIndex].scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
}

// Handle smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    }
});