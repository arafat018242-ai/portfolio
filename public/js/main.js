// Main JavaScript for portfolio website
const API_URL = window.location.origin;

// Fetch and display projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/api/projects`);
        const projects = await response.json();

        const projectsGrid = document.getElementById('projects-grid');

        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p class="loading">No projects available yet.</p>';
            return;
        }

        projectsGrid.innerHTML = projects.map(project => `
      <div class="project-card">
        ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image">` : '<div class="project-image"></div>'}
        <div class="project-content">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-description">${project.description}</p>
          <div class="project-tech">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" class="project-link link-live">Live Demo</a>` : ''}
            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" class="project-link link-github">GitHub</a>` : ''}
          </div>
        </div>
      </div>
    `).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML = '<p class="loading">Failed to load projects.</p>';
    }
}

// Fetch and display skills
async function loadSkills() {
    try {
        const response = await fetch(`${API_URL}/api/skills`);
        const skills = await response.json();

        const skillsContainer = document.getElementById('skills-container');

        if (skills.length === 0) {
            skillsContainer.innerHTML = '<p class="loading">No skills available yet.</p>';
            return;
        }

        skillsContainer.innerHTML = skills.map(skill => {
            let proficiencyDisplay = skill.proficiency;

            // Map numeric proficiency to labels for legacy data
            if (!isNaN(skill.proficiency) && skill.proficiency !== '') {
                const p = parseInt(skill.proficiency);
                if (p <= 25) proficiencyDisplay = 'Beginner';
                else if (p <= 50) proficiencyDisplay = 'Intermediate';
                else if (p <= 75) proficiencyDisplay = 'Advanced';
                else proficiencyDisplay = 'Professional';
            }

            return `
      <div class="skill-card">
        <span class="skill-category">${skill.category}</span>
        <div class="skill-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            ${skill.iconUrl ? `<img src="${skill.iconUrl}" alt="${skill.name}" style="width: 24px; height: 24px; object-fit: contain;">` : ''}
            <span class="skill-name">${skill.name}</span>
          </div>
          <span class="skill-percentage">${proficiencyDisplay}</span>
        </div>
        ${skill.certificateUrl ? `
          <div class="skill-footer" style="margin-top: 10px; display: flex; justify-content: flex-end;">
            <a href="${skill.certificateUrl}" target="_blank" class="project-link link-live" style="padding: 4px 12px; font-size: 0.8rem; flex: none;">View Certificate</a>
          </div>
        ` : ''}
      </div>
    `}).join('');

        // Animate skill bars
        setTimeout(() => {
            document.querySelectorAll('.skill-progress').forEach(bar => {
                bar.style.width = bar.style.width;
            });
        }, 100);
    } catch (error) {
        console.error('Error loading skills:', error);
        document.getElementById('skills-container').innerHTML = '<p class="loading">Failed to load skills.</p>';
    }
}

// Fetch and display about section
async function loadAbout() {
    try {
        const response = await fetch(`${API_URL}/api/about`);
        const about = await response.json();

        const aboutContent = document.getElementById('about-content');

        if (!about.bio && !about.profileImageUrl) {
            aboutContent.innerHTML = '<p class="loading">About information coming soon.</p>';
            return;
        }

        aboutContent.innerHTML = `
      ${about.profileImageUrl ? `
        <img src="${about.profileImageUrl}" alt="Profile" class="about-image">
      ` : ''}
      <div class="about-text">
        <p>${about.bio || 'Welcome to my portfolio!'}</p>
        ${about.social ? `
          <div class="social-links">
            ${about.social.github ? `<a href="${about.social.github}" target="_blank" class="social-link" title="GitHub">GitHub</a>` : ''}
            ${about.social.linkedin ? `<a href="${about.social.linkedin}" target="_blank" class="social-link" title="LinkedIn">LinkedIn</a>` : ''}
            ${about.social.twitter ? `<a href="${about.social.twitter}" target="_blank" class="social-link" title="Twitter">Twitter</a>` : ''}
            ${about.social.email ? `<a href="mailto:${about.social.email}" class="social-link" title="Email">Email</a>` : ''}
          </div>
        ` : ''}
      </div>
    `;

        // Also update footer social links
        if (about.social) {
            const footerSocial = document.getElementById('social-links');
            footerSocial.innerHTML = `
        ${about.social.github ? `<a href="${about.social.github}" target="_blank" class="social-link">GitHub</a>` : ''}
        ${about.social.linkedin ? `<a href="${about.social.linkedin}" target="_blank" class="social-link">LinkedIn</a>` : ''}
        ${about.social.twitter ? `<a href="${about.social.twitter}" target="_blank" class="social-link">Twitter</a>` : ''}
      `;
        }
    } catch (error) {
        console.error('Error loading about:', error);
        document.getElementById('about-content').innerHTML = '<p class="loading">Failed to load about information.</p>';
    }
}

// Handle contact form submission
async function handleContactForm(e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    const formMessage = document.getElementById('form-message');
    const submitButton = e.target.querySelector('button[type="submit"]');

    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
        const response = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            formMessage.className = 'form-message success';
            formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            e.target.reset();
        } else {
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        formMessage.className = 'form-message error';
        formMessage.textContent = error.message || 'Failed to send message. Please try again.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Smooth scroll for navigation links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadSkills();
    loadAbout();
    initSmoothScroll();

    // Add contact form listener
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Add active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add('active');
            } else {
                navLink?.classList.remove('active');
            }
        });
    });
});
