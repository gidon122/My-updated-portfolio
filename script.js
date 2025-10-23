// DOMContentLoaded ensures the script runs after the HTML is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // 1. Scroll to Top button functionality
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) { // Ensure the button exists before adding listeners
        window.addEventListener('scroll', () => {
            // Show/hide the button based on scroll position
            if (window.scrollY > 300) { // Adjusted threshold for better visibility
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            // Smooth scroll to the top of the page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 2. Project filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) { // Ensure elements exist
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove 'active' class from all filter buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add 'active' class to the clicked button
                this.classList.add('active');

                const filter = this.dataset.filter; // Use dataset for cleaner access

                projectCards.forEach(card => {
                    // Show or hide project cards based on the selected filter
                    if (filter === 'all' || card.dataset.tech === filter) {
                        card.style.display = 'flex'; // Display as flex to maintain layout
                    } else {
                        card.style.display = 'none'; // Hide
                    }
                });
            });
        });
    }

    // 3. Section animation on scroll using Intersection Observer
    const sections = document.querySelectorAll('.section');

    if (sections.length > 0) { // Ensure sections exist
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target); // Stop observing once in view
                }
            });
        }, {
            threshold: 0.15 // Section becomes 'in-view' when 15% is visible
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // 4. Contact form validation
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm && formMessage) { // Ensure form elements exist
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission

            const name = contactForm.name.value.trim();
            const email = contactForm.email.value.trim();
            const message = contactForm.message.value.trim();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

            // Form validation logic
            if (!name || !email || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.style.color = '#e57373'; // Error color
                return;
            }

            if (!emailPattern.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.style.color = '#e57373'; // Error color
                return;
            }

            // Send email using EmailJS
            formMessage.textContent = 'Sending...';
            formMessage.style.color = '#6ec1e4';

            emailjs.send('service_1ejiuqb', 'template_wlya5xa', {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'ufarunagidosky@gmail.com'
            })
            .then(function(response) {
                formMessage.textContent = 'Message sent successfully!';
                formMessage.style.color = '#6ec1e4';
                contactForm.reset();
            }, function(error) {
                formMessage.textContent = 'Failed to send message. Please try again later.';
                formMessage.style.color = '#e57373';
            });
        });
    }

    // 5. Active navigation link on scroll
    const navLinks = document.querySelectorAll('.nav-links a');
    const sectionsForNav = document.querySelectorAll('section'); // Assuming sections have IDs matching nav hrefs

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.7) { // Section is mostly visible
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.7, // Adjust as needed, e.g., 0.5 for half-way, 0.7 for more of the section
        rootMargin: "-50% 0px -50% 0px" // Optional: helps center the intersection
    });

    sectionsForNav.forEach(section => {
        navObserver.observe(section);
    });

    // Handle initial active link on page load
    // This part is a bit tricky with IntersectionObserver for initial state.
    // A simple workaround for initial load:
    if (window.location.hash) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === window.location.hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } else {
        // Default to 'Home' if no hash
        document.querySelector('.nav-links a[href="#home"]').classList.add('active');
    }

    // 6. Smooth scrolling for internal navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('.navbar')?.offsetHeight || 0), // Adjust for fixed navbar height
                    behavior: 'smooth'
                });

                // Update active class for nav links
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

});