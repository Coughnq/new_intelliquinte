document.addEventListener('DOMContentLoaded', function() {
    // Initialize active navigation
    initializeActiveNavigation();
    
    // Add progress indicator
    addProgressIndicator();
    
    // Add back to top button
    addBackToTopButton();
    
    // Add theme toggle (dark mode)
    addThemeToggle();
    
    // Add search functionality
    addSearchFunctionality();
    
    // Initialize interactive elements
    initializeAccordions();
    initializeTabs();
    initializeTabsDirect();
    initializeSidebar();
    addTooltips();
});

// Update active navigation based on scroll position
function initializeActiveNavigation() {
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-container a');
    const sidebarLinks = document.querySelectorAll('.nav-item a, .sub-nav-item a');
    
    // Get all sections for scroll tracking
    const allSections = Array.from(sections);
    
    // Create an observer for checking which section is in view
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -85% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update top navigation
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    link.classList.toggle('active', href === id);
                });
                
                // Update sidebar navigation
                sidebarLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    
                    if (href === id) {
                        // Remove 'current' class from all sidebar links
                        sidebarLinks.forEach(l => l.classList.remove('current'));
                        
                        // Add 'current' class to the active link
                        link.classList.add('current');
                        
                        // Expand parent if in sub-navigation
                        if (link.closest('.sub-nav-item')) {
                            const parentItem = link.closest('.nav-item');
                            const parentLink = parentItem.querySelector('a');
                            parentLink.classList.add('active');
                        }
                    }
                });
                
                // Update URL hash without scrolling
                if (history.pushState) {
                    history.pushState(null, null, `#${id}`);
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    allSections.forEach(section => {
        observer.observe(section);
    });
    
    // Initially set active based on hash
    setTimeout(() => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                targetSection.scrollIntoView();
            }
        }
    }, 100);
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

// Add dark mode toggle
function addThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    
    // Set initial icon based on preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    
    let isDarkMode = false;
    
    // Check if theme is stored in localStorage or use system preference
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        isDarkMode = true;
    }
    
    // Update icon based on current theme
    themeToggle.innerHTML = isDarkMode 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    
    document.body.appendChild(themeToggle);
    
    // Toggle theme when clicked
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update icon
        themeToggle.innerHTML = isDark
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    });
}

// Add search functionality
function addSearchFunctionality() {
    const header = document.querySelector('header .container');
    
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    
    // Create search icon
    const searchIcon = document.createElement('span');
    searchIcon.className = 'search-icon';
    searchIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
    
    // Create search input
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'search-input';
    searchInput.placeholder = 'Search the guidelines...';
    
    // Add elements to search container
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(searchInput);
    
    // Add search container to header
    header.appendChild(searchContainer);
    
    // Set up search functionality
    searchInput.addEventListener('keyup', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        // Only search if the term is at least 3 characters long
        if (searchTerm.length < 3) return;
        
        // Get all text content sections
        const textContents = document.querySelectorAll('.text-content');
        let matchCount = 0;
        
        // Remove existing highlights
        document.querySelectorAll('.search-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
        
        // Search through text content
        textContents.forEach(content => {
            // Skip searching in nested components like accordions
            const childContent = Array.from(content.childNodes).filter(node => 
                !node.classList || 
                (!node.classList.contains('accordion') && 
                 !node.classList.contains('tab-system'))
            );
            
            childContent.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    if (text.toLowerCase().includes(searchTerm)) {
                        matchCount++;
                        
                        // Highlight matched text
                        const highlightedText = text.replace(
                            new RegExp(searchTerm, 'gi'),
                            match => `<span class="search-highlight" style="background-color: yellow; color: black;">${match}</span>`
                        );
                        
                        const newNode = document.createElement('span');
                        newNode.innerHTML = highlightedText;
                        node.parentNode.replaceChild(newNode, node);
                    }
                } else if (node.nodeType === Node.ELEMENT_NODE && node.textContent) {
                    if (node.textContent.toLowerCase().includes(searchTerm)) {
                        matchCount++;
                        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
        });
        
        // Show search results count - could be enhanced with a proper UI
        console.log(`Found ${matchCount} matches for "${searchTerm}"`);
    }, 300));
}

// Initialize accordion functionality
function initializeAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Check if this accordion is already active
            const isActive = item.classList.contains('active');
            
            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle the clicked item
            item.classList.toggle('active', !isActive);
        });
    });
}

// Initialize tab system
function initializeTabs() {
    const tabSystems = document.querySelectorAll('.tab-system');
    
    tabSystems.forEach(system => {
        const tabNavItems = system.querySelectorAll('.tab-nav-item');
        const tabContents = system.querySelectorAll('.tab-content');
        
        // Ensure tab contents are properly initialized
        if (tabNavItems.length > 0 && tabContents.length > 0) {
            // Ensure first tab is active on page load
            if (!system.querySelector('.tab-nav-item.active')) {
                tabNavItems[0].classList.add('active');
                tabContents[0].classList.add('active');
            }
            
            tabNavItems.forEach(navItem => {
                navItem.addEventListener('click', () => {
                    const tabId = navItem.getAttribute('data-tab');
                    
                    // Deactivate all tabs
                    tabNavItems.forEach(item => item.classList.remove('active'));
                    tabContents.forEach(content => content.classList.remove('active'));
                    
                    // Activate the clicked tab
                    navItem.classList.add('active');
                    
                    // Find and activate the corresponding content
                    const targetContent = system.querySelector(`#${tabId}`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    } else {
                        console.error(`Tab content with id ${tabId} not found`);
                    }
                });
            });
        } else {
            console.warn('Tab system missing nav items or content elements');
        }
    });
    
    // Log for debugging
    console.log(`Initialized ${tabSystems.length} tab systems`);
}

// Direct tab initialization function for immediate functionality
function initializeTabsDirect() {
    const tabNavItems = document.querySelectorAll('.tab-nav-item');
    
    tabNavItems.forEach(navItem => {
        navItem.addEventListener('click', function() {
            // Find the parent tab system
            const tabSystem = this.closest('.tab-system');
            if (!tabSystem) return;
            
            const tabId = this.getAttribute('data-tab');
            if (!tabId) return;
            
            // Find all nav items and content tabs in this system
            const siblingNavItems = tabSystem.querySelectorAll('.tab-nav-item');
            const tabContents = tabSystem.querySelectorAll('.tab-content');
            
            // Deactivate all
            siblingNavItems.forEach(item => item.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate current
            this.classList.add('active');
            
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    console.log('Direct tab initialization completed');
}

// Initialize sidebar functionality
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        // Toggle sidebar on button click
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarToggle.classList.toggle('active', sidebar.classList.contains('active'));
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            if (window.innerWidth < 1024 && 
                !sidebar.contains(event.target) && 
                event.target !== sidebarToggle) {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('active');
            }
        });
        
        // Get all navigation links
        const navLinks = sidebar.querySelectorAll('.nav-item a, .sub-nav-item a');
        
        // Add click event listeners to all navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    // Get the target section
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        e.preventDefault();
                        
                        // Remove 'current' class from all links
                        navLinks.forEach(l => l.classList.remove('current'));
                        
                        // Add 'current' class to clicked link
                        link.classList.add('current');
                        
                        // Close sidebar on mobile after clicking a link
                        if (window.innerWidth < 1024) {
                            sidebar.classList.remove('active');
                            sidebarToggle.classList.remove('active');
                        }
                        
                        // If this is a sub-nav item, make sure its parent is expanded
                        if (link.closest('.sub-nav-item')) {
                            const parentNav = link.closest('.nav-item');
                            if (parentNav) {
                                const parentLink = parentNav.querySelector('a');
                                parentLink.classList.add('expanded');
                            }
                        }
                        
                        // Scroll to the section
                        window.scrollTo({
                            top: targetSection.offsetTop - 60,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Handle parent items with sub-navigation
        const parentItems = sidebar.querySelectorAll('.nav-item:has(.sub-nav-items)');
        
        // If :has selector is not supported, use alternative method
        if (parentItems.length === 0) {
            const allItems = sidebar.querySelectorAll('.nav-item');
            allItems.forEach(item => {
                if (item.querySelector('.sub-nav-items')) {
                    // This is a parent item
                    handleParentItem(item);
                }
            });
        } else {
            parentItems.forEach(item => {
                handleParentItem(item);
            });
        }
        
        // Set initial active state based on current scroll position
        updateActiveNavItemOnScroll();
        
        // Update active state on scroll
        window.addEventListener('scroll', debounce(updateActiveNavItemOnScroll, 100));
    }
    
    // Function to handle parent items with sub-navigation
    function handleParentItem(item) {
        const link = item.querySelector('a');
        const subNav = item.querySelector('.sub-nav-items');
        
        if (link && subNav) {
            // Ensure sub-nav is initially visible if it contains the current page
            if (subNav.querySelector('a.current')) {
                subNav.style.display = 'block';
                link.classList.add('expanded');
            } else {
                // Otherwise collapse it
                subNav.style.display = 'none';
            }
            
            // Toggle sub-nav when clicking the parent link
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle sub-nav display
                const isHidden = subNav.style.display === 'none' || !subNav.style.display;
                subNav.style.display = isHidden ? 'block' : 'none';
                link.classList.toggle('expanded', isHidden);
            });
        }
    }
    
    // Function to update active nav item based on scroll position
    function updateActiveNavItemOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        // Get all page sections
        const sections = document.querySelectorAll('.page-section');
        
        // Find the current section
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });
        
        if (currentSectionId) {
            // Update the active state in the sidebar
            const navLinks = sidebar.querySelectorAll('.nav-item a, .sub-nav-item a');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const linkSectionId = href.replace('#', '');
                    link.classList.toggle('current', linkSectionId === currentSectionId);
                    
                    // If this is a current sub-nav item, make sure its parent nav is expanded
                    if (linkSectionId === currentSectionId && link.closest('.sub-nav-item')) {
                        const parentNav = link.closest('.nav-item');
                        if (parentNav) {
                            const parentLink = parentNav.querySelector('a');
                            const subNav = parentNav.querySelector('.sub-nav-items');
                            if (parentLink && subNav) {
                                subNav.style.display = 'block';
                                parentLink.classList.add('expanded');
                            }
                        }
                    }
                }
            });
        }
    }
}

// Add tooltip functionality to elements with data-tooltip attribute
function addTooltips() {
    // Find all elements with data-tooltip attribute
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.classList.add('custom-tooltip');
    });
}

// Helper function to debounce frequent events
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Load additional content using fetch for SPA-like behavior
function loadContent(url) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc.querySelector('.content-area').innerHTML;
        });
}

// Handle print functionality
function printPage() {
    window.print();
}

// Initialize image galleries with lightbox
function initializeImageGalleries() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Create lightbox when an image is clicked
            const img = item.querySelector('img');
            if (img) {
                const lightbox = document.createElement('div');
                lightbox.className = 'lightbox';
                lightbox.innerHTML = `
                    <div class="lightbox-content">
                        <img src="${img.src}" alt="${img.alt || 'Gallery image'}">
                        <span class="close-lightbox">&times;</span>
                    </div>
                `;
                
                document.body.appendChild(lightbox);
                
                // Close lightbox when clicking anywhere
                lightbox.addEventListener('click', () => {
                    lightbox.remove();
                });
                
                // Prevent propagation on image click
                lightbox.querySelector('img').addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
        });
    });
}

// Handle keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Esc key closes mobile sidebar
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        }
        
        // Arrow keys navigation between sections
        if (e.key === 'ArrowDown' && e.altKey) {
            const sections = document.querySelectorAll('.page-section');
            const activeSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });
            
            if (activeSection) {
                const nextSection = activeSection.nextElementSibling;
                if (nextSection && nextSection.classList.contains('page-section')) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        
        if (e.key === 'ArrowUp' && e.altKey) {
            const sections = document.querySelectorAll('.page-section');
            const activeSection = Array.from(sections).find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom > 100;
            });
            
            if (activeSection) {
                const prevSection = activeSection.previousElementSibling;
                if (prevSection && prevSection.classList.contains('page-section')) {
                    prevSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
} 