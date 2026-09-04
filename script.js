/**
 * SURAJIT MONDAL - 3D PORTFOLIO JAVASCRIPT ENGINE
 * Handles Three.js 3D Scene, Particle Grid, Custom Cursor, Dynamic Typist,
 * Scroll Spy, Theme Switching, Project/Skill Filters, Modals & Form Handlers.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. PRELOADER & INITIALIZATION ====================
  const preloader = document.getElementById('preloader');
  const loaderFill = document.getElementById('loaderFill');

  let loadProgress = 0;
  const progressInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 20) + 10;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(progressInterval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.add('loaded');
        animateSkillBars();
        animateStatsCounters();
      }, 400);
    }
    if (loaderFill) loaderFill.style.width = `${loadProgress}%`;
  }, 70);


  // ==================== 2. THEME SWITCHER (DARK / LIGHT) ====================
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('sm_portfolio_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sm_portfolio_theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
      
      // Update Three.js particles color if scene exists
      if (window.updateSceneTheme) {
        window.updateSceneTheme(newTheme);
      }
    });
  }


  // ==================== 3. CUSTOM 3D MOUSE CURSOR ====================
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const animateCursor = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Hover effect on clickable elements
    const hoverables = document.querySelectorAll('a, button, input, textarea, .glass-panel, .skill-card, .project-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovered-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovered-link'));
    });
  }


  // ==================== 4. THREE.JS 3D INTERACTIVE CANVAS ====================
  const initThreeScene = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles Cloud
    const particleCount = window.innerWidth < 768 ? 400 : 900;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x06b6d4); // Cyan
    const color2 = new THREE.Color(0x8b5cf6); // Purple
    const color3 = new THREE.Color(0x3b82f6); // Blue

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 60;

      const mixedColor = Math.random() > 0.5 ? color1.clone().lerp(color2, Math.random()) : color2.clone().lerp(color3, Math.random());
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular particle texture
    const createParticleTexture = () => {
      const c = document.createElement('canvas');
      c.width = 32;
      c.height = 32;
      const ctx = c.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(c);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 3D Geometric Floating Wireframe Polyhedrons
    const polyGeo1 = new THREE.IcosahedronGeometry(4, 1);
    const polyMat1 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const polyMesh1 = new THREE.Mesh(polyGeo1, polyMat1);
    polyMesh1.position.set(16, 10, -10);
    scene.add(polyMesh1);

    const polyGeo2 = new THREE.TorusGeometry(3.5, 1.2, 16, 50);
    const polyMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const polyMesh2 = new THREE.Mesh(polyGeo2, polyMat2);
    polyMesh2.position.set(-18, -12, -8);
    scene.add(polyMesh2);

    const polyGeo3 = new THREE.OctahedronGeometry(3, 0);
    const polyMat3 = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const polyMesh3 = new THREE.Mesh(polyGeo3, polyMat3);
    polyMesh3.position.set(-14, 14, -12);
    scene.add(polyMesh3);

    // Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX - windowHalfX) * 0.0008;
      targetMouseY = (e.clientY - windowHalfY) * 0.0008;
    });

    // Handle Resize
    window.addEventListener('resize', () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate particles & polyhedrons
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      polyMesh1.rotation.x += 0.005;
      polyMesh1.rotation.y += 0.008;
      polyMesh1.position.y = 10 + Math.sin(elapsedTime * 0.8) * 1.5;

      polyMesh2.rotation.x += 0.004;
      polyMesh2.rotation.y += 0.006;
      polyMesh2.position.y = -12 + Math.cos(elapsedTime * 0.7) * 1.5;

      polyMesh3.rotation.z += 0.006;
      polyMesh3.rotation.x += 0.005;

      // Smooth camera parallax
      camera.position.x += (targetMouseX * 18 - camera.position.x) * 0.04;
      camera.position.y += (-targetMouseY * 18 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    window.updateSceneTheme = (theme) => {
      if (theme === 'light') {
        particleMaterial.opacity = 0.55;
        polyMat1.opacity = 0.25;
        polyMat2.opacity = 0.2;
      } else {
        particleMaterial.opacity = 0.85;
        polyMat1.opacity = 0.18;
        polyMat2.opacity = 0.15;
      }
    };
  };

  initThreeScene();


  // ==================== 5. DYNAMIC TYPING EFFECT ====================
  const typedRole = document.getElementById('typedRole');
  const roles = [
    'BCA Student @ Midnapore City College',
    'Full-Stack Web Developer',
    'C++ & Data Structures Enthusiast',
    'Python & Automation Programmer',
    'Relational DBMS & SQL Architect',
    'Creative UI/UX Designer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  const typeRoles = () => {
    if (!typedRole) return;
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedRole.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typedRole.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1600; // Pause at end
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(typeRoles, typingSpeed);
  };

  typeRoles();


  // ==================== 6. SCROLL PROGRESS & NAVIGATION SPY ====================
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressPercent = docHeight > 0 ? (scrollPos / docHeight) * 100 : 0;

    // Scroll Progress
    if (scrollProgress) scrollProgress.style.width = `${progressPercent}%`;

    // Header Background Blur on Scroll
    if (siteHeader) {
      if (scrollPos > 50) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Active Section Tracking (Scroll Spy)
    let currentSectionId = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Check visibility for animated components
    triggerScrollAnimations();
  });


  // ==================== 7. MOBILE DRAWER NAVIGATION ====================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  // ==================== 8. 3D TILT EFFECT FOR CARDS ====================
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      perspective: 1000
    });
  }


  // ==================== 9. SKILLS FILTER & ANIMATED PROGRESS BARS ====================
  const skillTabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-skill-tab');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => card.classList.add('animated'), 50);
        } else {
          card.style.display = 'none';
          card.classList.remove('animated');
        }
      });
    });
  });

  function animateSkillBars() {
    skillCards.forEach(card => card.classList.add('animated'));
  }


  // ==================== 10. ANIMATED STATS COUNTERS ====================
  let statsAnimated = false;
  function animateStatsCounters() {
    if (statsAnimated) return;
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      let count = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        count += step;
        if (count >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = count;
        }
      }, 35);
    });
    statsAnimated = true;
  }


  // ==================== 11. PROJECT FILTERING ====================
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ==================== 12. PROJECT QUICK-VIEW & DEMO MODALS ====================
  const projectModal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalProjTitle = document.getElementById('modalProjTitle');
  const modalProjDesc = document.getElementById('modalProjDesc');
  const modalProjTag = document.getElementById('modalProjTag');
  const modalProjTech = document.getElementById('modalProjTech');

  const sampleProjectsData = {
    '1': {
      title: '3D Algorithm & Sorting Visualizer',
      tag: 'Interactive WebGL / DSA',
      desc: 'A comprehensive interactive 3D WebGL simulator designed to visualize sorting algorithms (QuickSort, MergeSort, HeapSort) and graph pathfinding traversals (Dijkstra, A* Search) with real-time speed control and array generation.',
      tech: ['JavaScript ES6+', 'Three.js', 'HTML5 Canvas', 'CSS Glassmorphism', 'DSA']
    },
    '2': {
      title: 'Campus & Student Management Portal',
      tag: 'Institutional ERP & Database',
      desc: 'An automated academic ERP suite built for managing undergraduate student databases, SGPA semester mark calculations, fee receipt generation, and relational SQL transactions with automated MySQL backups.',
      tech: ['Python 3.11', 'MySQL Database', 'Flask Framework', 'Jinja2', 'ReportLab PDF']
    },
    '3': {
      title: 'DevFlow Cloud Kanban & Sprint Studio',
      tag: 'Full-Stack Web Workspace',
      desc: 'Modern task management productivity software featuring responsive Kanban boards, custom tags, time tracking Pomodoro module, dark mode theme persistence, and markdown code snippet manager.',
      tech: ['React.js', 'CSS Modules', 'LocalStorage API', 'Drag & Drop API']
    },
    '4': {
      title: 'Smart Examination & Merit Evaluator',
      tag: 'Java Desktop & JDBC System',
      desc: 'High-security desktop software providing cryptographic authentication for college examiners, automated ranking computation, batch mark-sheet printing, and JDBC relational database connectivity.',
      tech: ['Java Core (JDK 17)', 'JavaFX / Swing', 'MySQL JDBC', 'OOP Design']
    },
    '5': {
      title: 'Atmospheric Sensor & Climate Dashboard',
      tag: 'Python Data Analytics',
      desc: 'Real-time meteorological analytics dashboard tracking air quality index (AQI), humidity levels, rainfall radar, and predictive 7-day temperature trends with interactive graphical charts.',
      tech: ['Python', 'OpenWeather REST API', 'Chart.js', 'Pandas Basics']
    },
    '6': {
      title: 'CyberStore Neo-Futuristic Commerce',
      tag: 'Modern E-Commerce Storefront',
      desc: 'Futuristic digital storefront featuring dynamic product catalog filtering, interactive cart slider drawer, discount code verification, invoice calculations, and simulated payment gateway.',
      tech: ['HTML5 Semantic', 'Modern Vanilla JS', 'CSS Grid', 'LocalStorage']
    }
  };

  const openProjectModal = (projId) => {
    const data = sampleProjectsData[projId];
    if (!data || !projectModal) return;

    modalProjTitle.textContent = data.title;
    modalProjTag.textContent = data.tag;
    modalProjDesc.textContent = data.desc;

    modalProjTech.innerHTML = '';
    data.tech.forEach(t => {
      const span = document.createElement('span');
      span.textContent = t;
      modalProjTech.appendChild(span);
    });

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('.quick-view-btn, .demo-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project-id');
      openProjectModal(projId);
    });
  });

  if (closeModalBtn && projectModal) {
    closeModalBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        projectModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }


  // ==================== 13. CERTIFICATE MODALS ====================
  const certModal = document.getElementById('certModal');
  const closeCertModalBtn = document.getElementById('closeCertModalBtn');
  const certModalTitle = document.getElementById('certModalTitle');
  const certModalOrg = document.getElementById('certModalOrg');
  const certModalId = document.getElementById('certModalId');

  document.querySelectorAll('.view-cert-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!certModal) return;
      certModalTitle.textContent = btn.getAttribute('data-cert-title');
      certModalOrg.textContent = btn.getAttribute('data-cert-org');
      certModalId.textContent = btn.getAttribute('data-cert-id');
      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeCertModalBtn && certModal) {
    closeCertModalBtn.addEventListener('click', () => {
      certModal.classList.remove('active');
      document.body.style.overflow = '';
    });
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }


  // ==================== 14. CONTACT FORM & VALIDATION ====================
  const contactForm = document.getElementById('contactForm');
  const formName = document.getElementById('formName');
  const formEmail = document.getElementById('formEmail');
  const formSubject = document.getElementById('formSubject');
  const formMessage = document.getElementById('formMessage');
  const submitFormBtn = document.getElementById('submitFormBtn');
  const btnText = document.getElementById('btnText');
  const btnSpinner = document.getElementById('btnSpinner');
  const formAlert = document.getElementById('formAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      resetFormErrors();

      if (!formName.value.trim()) {
        showError('nameError', 'Please enter your full name');
        isValid = false;
      }

      const emailVal = formEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        showError('emailError', 'Please provide a valid email address');
        isValid = false;
      }

      if (!formSubject.value.trim()) {
        showError('subjectError', 'Please enter a subject');
        isValid = false;
      }

      if (!formMessage.value.trim() || formMessage.value.trim().length < 10) {
        showError('messageError', 'Message should be at least 10 characters');
        isValid = false;
      }

      if (!isValid) return;

      // Simulated Transmission
      btnText.textContent = 'Transmitting...';
      btnSpinner.classList.remove('hide');
      submitFormBtn.disabled = true;

      setTimeout(() => {
        btnText.textContent = 'Transmit Message';
        btnSpinner.classList.add('hide');
        submitFormBtn.disabled = false;

        formAlert.className = 'form-feedback-alert success';
        formAlert.textContent = '🚀 Thank you! Your message has been transmitted successfully to Surajit.';
        formAlert.classList.remove('hide');

        showToast('Message sent successfully!', 'success');
        contactForm.reset();

        setTimeout(() => {
          formAlert.classList.add('hide');
        }, 6000);
      }, 1200);
    });
  }

  function showError(id, message) {
    const errorEl = document.getElementById(id);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  }

  function resetFormErrors() {
    document.querySelectorAll('.form-error-msg').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
    if (formAlert) formAlert.classList.add('hide');
  }


  // ==================== 15. TOAST NOTIFICATION UTILITY ====================
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-info-circle';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }


  // ==================== 16. PRINT & RESUME HELPERS ====================
  const printResumeBtn = document.getElementById('printResumeBtn');
  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }


  // ==================== 17. SCROLL TRIGGER ANIMATIONS ====================
  function triggerScrollAnimations() {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      const rect = aboutSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        animateStatsCounters();
      }
    }
  }

});
