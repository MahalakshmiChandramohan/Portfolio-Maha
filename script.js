/**
 * Mahalakshmi - CSE Portfolio Website Scripts
 * Fully vanilla JavaScript implementing typing animations, theme switching,
 * scroll observers, navigation triggers, counters, loading screen, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. LOADING SCREEN FADE-OUT
       ========================================================================== */
    const loadingScreen = document.getElementById('loadingScreen');
    const body = document.body;

    // Simulate loader delay for aesthetic transition
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                body.classList.remove('loading');
            }
        }, 600); // 600ms delay for smooth transition
    });

    // Fallback if load event doesn't fire immediately
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
            loadingScreen.classList.add('fade-out');
            body.classList.remove('loading');
        }
    }, 2000);


    /* ==========================================================================
       2. SCROLL PROGRESS INDICATOR
       ========================================================================== */
    const scrollProgressBar = document.getElementById('scrollProgressBar');

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const scrollPercentage = (window.scrollY / totalHeight) * 100;
            if (scrollProgressBar) {
                scrollProgressBar.style.width = `${scrollPercentage}%`;
            }
        }
    });


    /* ==========================================================================
       3. THEME SWITCHER (DARK / LIGHT MODE)
       ========================================================================== */
    const themeToggle = document.getElementById('themeToggle');

    // Retrieve saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    
    if (savedTheme) {
        body.className = savedTheme;
        // Keep loading scroll lock state if page isn't fully loaded
        if (!loadingScreen.classList.contains('fade-out')) {
            body.classList.add('loading');
        }
    } else {
        // Default to light theme (white & beige) for modern presentation
        body.classList.add('light-theme');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });


    /* ==========================================================================
       4. MOBILE HAMBURGER MENU
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu state
    navToggle.addEventListener('click', () => {
        const isOpen = navToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen);
        body.classList.toggle('menu-open', isOpen);
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', false);
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('open');
            navMenu.classList.remove('open');
            navToggle.setAttribute('aria-expanded', false);
            body.classList.remove('menu-open');
        }
    });


    /* ==========================================================================
       5. STICKY NAVBAR & BACK-TO-TOP BUTTON
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Header sticky state
        if (scrollPos > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollPos > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    /* ==========================================================================
       6. TYPING ANIMATION (HERO GREETING)
       ========================================================================== */
    const typingTextEl = document.getElementById('typing-text');
    const phrases = [
        "Final Year CSE Student.",
        "Aspiring Software Developer.",
        "Backend Developer.",
        "DSA Enthusiast."
    ];
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            // Remove character
            typingTextEl.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            typingSpeed = 40; // Deleting goes faster
        } else {
            // Add character
            typingTextEl.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            typingSpeed = 90; // Standard typing speed
        }

        if (!isDeleting && characterIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2200; // Pause at the end of the line
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Small pause before next word starts
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typingTextEl) {
        typeEffect();
    }


    /* ==========================================================================
       7. INTERSECTION OBSERVER: REVEAL ELEMENTS & SKILLS FILL
       ========================================================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    // Store target widths and set to 0% initially for trigger animation
    const skillBarWidths = [];
    skillBars.forEach((bar, index) => {
        skillBarWidths[index] = bar.style.width;
        bar.style.width = '0%';
    });

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                
                // If skills section is revealed, animate progress bar width
                if (entry.target.id === 'skills') {
                    skillBars.forEach((bar, index) => {
                        bar.style.width = skillBarWidths[index];
                    });
                }
                
                // Stop observing once animated in
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.12 // Trigger when 12% is visible
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ==========================================================================
       8. CODING PROFILE STATS COUNTER ANIMATIONS
       ========================================================================== */
    const counterElements = document.querySelectorAll('.counter-num');
    
    function animateCounter(counterEl) {
        const target = +counterEl.getAttribute('data-target');
        const duration = 1500; // Duration of animation in ms
        const increment = target / (duration / 16); // ~60fps refresh rate
        let currentValue = 0;

        const updateCounter = () => {
            currentValue += increment;
            if (currentValue < target) {
                counterEl.textContent = Math.ceil(currentValue);
                requestAnimationFrame(updateCounter);
            } else {
                counterEl.textContent = target; // Ensure exact final value
            }
        };

        updateCounter();
    }

    const counterObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Trigger count up animation only once
            }
        });
    };

    const counterObserver = new IntersectionObserver(counterObserverCallback, {
        root: null,
        threshold: 0.5
    });

    counterElements.forEach(counter => {
        counterObserver.observe(counter);
    });


    /* ==========================================================================
       9. SCROLL ACTIVE LINK HIGHLIGHTING
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    const navObserverCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const navObserver = new IntersectionObserver(navObserverCallback, {
        root: null,
        rootMargin: '-35% 0px -35% 0px' // Center area check
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });


    /* ==========================================================================
       10. CONTACT FORM VALIDATION & FEEDBACK
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const subjectInput = document.getElementById('formSubject');
    const messageInput = document.getElementById('formMessage');
    const formFeedback = document.getElementById('formFeedback');

    // Error labels
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Field-level validators
    function validateName() {
        const isValid = nameInput.value.trim() !== "";
        toggleErrorState(nameInput.parentElement.parentElement, nameError, !isValid);
        return isValid;
    }

    function validateEmail() {
        const emailVal = emailInput.value.trim();
        const isValid = emailVal !== "" && emailPattern.test(emailVal);
        toggleErrorState(emailInput.parentElement.parentElement, emailError, !isValid);
        return isValid;
    }

    function validateSubject() {
        const isValid = subjectInput.value.trim() !== "";
        toggleErrorState(subjectInput.parentElement.parentElement, subjectError, !isValid);
        return isValid;
    }

    function validateMessage() {
        const isValid = messageInput.value.trim() !== "";
        toggleErrorState(messageInput.parentElement.parentElement, messageError, !isValid);
        return isValid;
    }

    function toggleErrorState(formGroup, errorEl, hasError) {
        if (hasError) {
            formGroup.classList.add('error');
        } else {
            formGroup.classList.remove('error');
        }
    }

    // Input change listeners for real-time validation clearing
    nameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    subjectInput.addEventListener('input', validateSubject);
    messageInput.addEventListener('input', validateMessage);

    // Form submission processing
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Perform validations
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            const submitBtn = document.getElementById('submitBtn');
            const originalBtnHtml = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            // Simulate server delivery
            setTimeout(() => {
                // Show success screen overlay
                formFeedback.classList.add('show');
                
                // Clean form inputs
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Hide overlay automatically after 4 seconds
                setTimeout(() => {
                    formFeedback.classList.remove('show');
                }, 4000);

            }, 1200);
        }
    });


    /* ==========================================================================
       11. LAZY LOADING FOR IMAGES / PORTFOLIO GRAPHICS
       ========================================================================== */
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    lazyImage.removeAttribute('loading');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(image => {
            lazyImageObserver.observe(image);
        });
    } else {
        // Fallback for older browsers
        lazyImages.forEach(image => {
            if (image.dataset.src) {
                image.src = image.dataset.src;
            }
        });
    }

});
