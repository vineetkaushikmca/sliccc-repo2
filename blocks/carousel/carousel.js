export default function decorate(block) {
  const slides = [...block.children];
  // Show first slide by default, hide others
  slides.forEach((slide, i) => {
    if (i > 0) slide.style.display = 'none';
  });
  
  // Simple auto-rotate
  let current = 0;
  setInterval(() => {
    slides[current].style.display = 'none';
    current = (current + 1) % slides.length;
    slides[current].style.display = '';
  }, 5000);
}
