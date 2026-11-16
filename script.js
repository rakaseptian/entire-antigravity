/**
 * Entire AI Test - Interactive Script
 * Features: Dark/Light Mode, Interactive Chat Simulation, Animated Counter, Mobile Menu
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light) with LocalStorage
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Check saved theme preference or system preference
  const savedTheme = localStorage.getItem('entire-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (!systemPrefersDark) {
    htmlElement.setAttribute('data-theme', 'light');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('entire-theme', newTheme);
  });

  // 2. Mobile Menu Navigation
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // 3. Dynamic Footer Year
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 4. Interactive AI Playground Simulation
  const promptForm = document.getElementById('promptForm');
  const promptInput = document.getElementById('promptInput');
  const chatWindow = document.getElementById('chatWindow');
  const chips = document.querySelectorAll('.chip');
  let isGenerating = false;

  // Sample AI Responses Map
  const cannedResponses = {
    "tentang": "Entire AI Test adalah representasi aplikasi antarmuka cerdas berbasis web statis. Dibangun tanpa dependensi berlebih, platform ini mengutamakan efisiensi pemuatan, desain responsif, dan interaktivitas yang mulus.",
    "teknologi": "Website ini memanfaatkan teknologi inti web: HTML5 semantik untuk struktur yang solid, CSS3 kustom (CSS Variables, Flexbox, CSS Grid, Glassmorphism), dan Vanilla JavaScript modern (ES6+) untuk logika interaktif tanpa runtime berat.",
    "css": "Berikut tips menulis CSS yang rapi:\n1. Manfaatkan CSS Custom Properties (Variables) untuk warna & spasi.\n2. Utamakan pendekatan Mobile-First dengan media query yang efisien.\n3. Gunakan clamp() untuk tipografi yang fluid di berbagai ukuran layar.",
    "kutipan": "\"Kecerdasan buatan bukan untuk menggantikan imajinasi manusia, melainkan menjadi kanvas yang memperluas batas kreativitas kita.\" — Entire AI",
    "default": "Pertanyaan menarik! Sebagai prototipe Entire AI Test, sistem telah memproses input Anda dengan sukses. Setiap komponen halaman ini siap dikembangkan lebih lanjut menjadi aplikasi web berskala penuh."
  };

  function getSmartResponse(userInput) {
    const query = userInput.toLowerCase();
    if (query.includes('tentang') || query.includes('entire')) {
      return cannedResponses.tentang;
    } else if (query.includes('teknologi') || query.includes('stack') || query.includes('bahasa')) {
      return cannedResponses.teknologi;
    } else if (query.includes('css') || query.includes('tips') || query.includes('rapi')) {
      return cannedResponses.css;
    } else if (query.includes('kutipan') || query.includes('quotes') || query.includes('mutiara')) {
      return cannedResponses.kutipan;
    }
    return cannedResponses.default;
  }

  function appendUserMessage(text) {
    const userDiv = document.createElement('div');
    userDiv.className = 'chat-message user-message';
    userDiv.innerHTML = `
      <div class="avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="message-bubble">
        <p>${escapeHtml(text)}</p>
      </div>
    `;
    chatWindow.appendChild(userDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function appendBotMessage(fullText) {
    isGenerating = true;
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-message bot-message';
    botDiv.innerHTML = `
      <div class="avatar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
          <rect x="4" y="8" width="16" height="12" rx="2"></rect>
          <circle cx="9" cy="13" r="1.5"></circle>
          <circle cx="15" cy="13" r="1.5"></circle>
          <path d="M10 17h4"></path>
        </svg>
      </div>
      <div class="message-bubble">
        <p class="bot-text"></p><span class="typing-cursor"></span>
      </div>
    `;
    chatWindow.appendChild(botDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    const textTarget = botDiv.querySelector('.bot-text');
    const cursor = botDiv.querySelector('.typing-cursor');
    let charIndex = 0;

    // Typewriter effect
    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        textTarget.textContent += fullText.charAt(charIndex);
        charIndex++;
        chatWindow.scrollTop = chatWindow.scrollHeight;
      } else {
        clearInterval(interval);
        cursor.remove();
        isGenerating = false;
      }
    }, 18);
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }

  function handleSendPrompt(text) {
    if (!text.trim() || isGenerating) return;
    
    appendUserMessage(text);
    promptInput.value = '';

    // Simulate short network delay before responding
    setTimeout(() => {
      const response = getSmartResponse(text);
      appendBotMessage(response);
    }, 350);
  }

  if (promptForm) {
    promptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSendPrompt(promptInput.value);
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const promptText = chip.getAttribute('data-prompt');
      handleSendPrompt(promptText);
    });
  });

  // 5. Animated Stats Counter (Intersection Observer)
  const statsSection = document.querySelector('.stats-section');
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsTriggered = false;

  function animateNumbers() {
    statNumbers.forEach(elem => {
      const target = parseFloat(elem.getAttribute('data-target'));
      const isDecimal = target % 1 !== 0;
      const duration = 1800; // ms
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out quadratic function
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = easeProgress * target;

        if (isDecimal) {
          elem.textContent = currentVal.toFixed(1);
        } else {
          elem.textContent = Math.round(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          elem.textContent = target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsTriggered) {
          statsTriggered = true;
          animateNumbers();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }
});
