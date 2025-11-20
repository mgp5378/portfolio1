// script.js - handles:
// - animated skill bars on load
// - experience click -> toast
// - contact form validation & submit behavior
// - download PDF button (uses html2pdf library if available)

/* ---------------------------
   Utility: Toast notifications
   --------------------------- */
function showToast(message, duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  // Remove after duration (with fade)
  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ---------------------------
   Experience click behavior
   --------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const expItems = document.querySelectorAll('.exp-item');
  expItems.forEach(item => {
    item.addEventListener('click', () => {
      const company = item.getAttribute('data-company') || item.querySelector('.company')?.textContent || 'the company';
      showToast(`Learn more about my role at ${company}`);
    });
  });

  // Animate skill bars
  const progressEls = document.querySelectorAll('.progress');
  progressEls.forEach(el => {
    const value = parseInt(el.dataset.progress || '0', 10);
    const inner = el.querySelector('span');
    // Force reflow then set width for transition effect
    requestAnimationFrame(() => {
      inner.style.width = `${value}%`;
    });
  });

  // Wire contact form
  const contactForm = document.getElementById('contact-form');
  const formError = document.getElementById('form-error');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formError.textContent = '';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errors = [];

    if (!name) errors.push('Please enter your name.');
    if (!emailRegex.test(email)) errors.push('Please enter a valid email address.');
    if (message.length < 10) errors.push('Message must be at least 10 characters long.');

    if (errors.length) {
      formError.textContent = errors.join(' ');
      // Focus first invalid field
      if (!name) document.getElementById('name').focus();
      else if (!emailRegex.test(email)) document.getElementById('email').focus();
      else document.getElementById('message').focus();
      return;
    }

    // If validation passes
    alert('Message sent successfully!');
    contactForm.reset();
  });

  // Download PDF button
  const downloadBtn = document.getElementById('download-pdf');
  downloadBtn.addEventListener('click', async () => {
    // Ensure html2pdf is loaded
    if (typeof html2pdf === 'undefined') {
      // Try to dynamically load from CDN
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js';
      script.onload = () => generatePDF();
      script.onerror = () => {
        alert('Could not load PDF library. Please include html2pdf.js by adding the script tag to your HTML.');
      };
      document.head.appendChild(script);
    } else {
      generatePDF();
    }

    function generatePDF() {
      const element = document.getElementById('page');
      // html2pdf options
      const opt = {
        margin:       0.4,
        filename:     'Mallory_Pierz_Resume.pdf',
        image:        { type: 'jpeg', quality: 0.95 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  });

  // If there's a resume docx link expected: set it to the uploaded resume file path (if available)
  // The developer environment provided an uploaded file path. If you want the direct link to the uploaded resume,
  // replace the anchor's href with the file URL served by your environment. For local dev, it might be:
  // document.getElementById('resume-link').href = '/path/to/MalloryPierzResumeOct2025.docx';
});
