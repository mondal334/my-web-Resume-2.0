# 🚀 Surajit Mondal - Premium 3D Futuristic Developer Portfolio

A modern, high-performance personal portfolio website engineered with **HTML5, CSS3 Glassmorphism, Vanilla JavaScript, and Three.js 3D WebGL** effects.

---

## 🌟 Key Highlights & Features

1. **3D WebGL Background Engine (Three.js)**:
   - Interactive particle mesh reacting to mouse velocity and parallax.
   - Smooth floating wireframe polyhedrons (Icosahedron, Torus, Octahedron).
   - Dynamic theme color adaptation on dark/light switch.

2. **Futuristic Dark & Light Mode**:
   - Cyber-themed neon accents (Cyan `#06b6d4`, Purple `#8b5cf6`, Pink `#ec4899`).
   - Clean professional light mode with high contrast and readable typography.
   - Automatic `localStorage` theme state persistence.

3. **Complete 20-Section Portfolio Architecture**:
   - **Hero Section**: 3D Profile frame, dynamic typing effect, social links, CTAs, 3D floating tech chips.
   - **About Me**: Bio matching BCA curriculum at Midnapore City College (Vidyasagar University), core strengths, live animated counter statistics.
   - **Technical Skills**: Filterable tabs (Languages, Web, Databases/Tools, CS Fundamentals) with animated skill progress bars.
   - **Project Showcase**: 6 interactive project cards with 3D tilt, Quick View popups, tech badges, and category filters (`All`, `Web`, `JavaScript`, `Python`, `Core`).
   - **Experience & Milestones**: Vertical neon milestone timeline.
   - **Education**: Detailed qualification cards for BCA, Higher Secondary (12th Grade - 69%), and Secondary Exam (10th Grade - 52%).
   - **Certifications**: 3D certification cards with verification IDs and interactive credential modals.
   - **Services**: 6 service offerings from Web Development to Code Optimization.
   - **Resume / CV**: Comprehensive curriculum vitae view + direct download and printable resume preview.
   - **Contact Form**: Glassmorphism form with real-time validation, feedback state, and direct contact details.
   - **Footer**: Brand tagline, navigation shortcuts, and Back-to-Top trigger.

4. **Custom 3D Cursor**:
   - Glowing fluid mouse tracker with magnetic hover expansion (automatically disabled on touch/mobile).

5. **100% Responsive & Accessible**:
   - Smooth hamburger navigation drawer for tablets and smartphones.
   - Zero horizontal overflow.

---

## 📂 Project Directory Structure

```
portfolio/
├── index.html            # Main semantic HTML structure & metadata
├── style.css             # Glassmorphism styling, CSS variables & animations
├── script.js             # Three.js 3D canvas, cursor, filters, typing & modal logic
├── assets/
│   ├── avatar.svg        # Sharp futuristic 3D vector avatar
│   ├── resume.html       # Printable & downloadable HTML Resume
│   └── resume.pdf        # (Place your PDF resume file here)
└── README.md             # Documentation & customization guide
```

---

## 🛠️ How to Customize Your Portfolio

### 1. Replace Profile Photo
- Place your photo inside `assets/` (e.g. `assets/profile.jpg`).
- Open `index.html` and update the `<img>` tag in the Hero section:
  ```html
  <img src="assets/profile.jpg" alt="Surajit Mondal - BCA Developer" class="profile-photo" id="profileImage">
  ```

### 2. Replace Resume PDF
- Place your resume PDF in `assets/resume.pdf`.
- The **Download Resume** button in `index.html` is already configured to target `assets/resume.pdf` or `assets/resume.html`.

### 3. Update Social Media Links
Search for `<!-- REPLACE_LINK:` in `index.html` and update your URLs:
- GitHub: `https://github.com/yourusername`
- LinkedIn: `https://linkedin.com/in/yourprofile`
- Instagram: `https://instagram.com/yourhandle`
- Email: `mailto:surajitmondal3340@gmail.com`

---

## 🚀 How to Run Locally

### Option 1: Double Click
Simply double-click `index.html` to open it in Google Chrome, Microsoft Edge, or Mozilla Firefox.

### Option 2: Live Server (VS Code)
1. Open the `portfolio/` folder in VS Code.
2. Right click `index.html` and select **"Open with Live Server"**.

---

## 🌐 Deploy to the Web (Free)

### Deploy on GitHub Pages:
1. Push this folder to a GitHub repository (e.g., `surajit-portfolio`).
2. Go to repository **Settings** &rarr; **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save** &mdash; your portfolio will be live at `https://<username>.github.io/<repo-name>/`.

---

© 2026 Surajit Mondal. Built with 3D WebGL & Modern Web Standards.
