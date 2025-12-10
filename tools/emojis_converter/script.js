// === Theme Toggle ===
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeToggle.checked);
  localStorage.setItem('darkMode', themeToggle.checked);
});
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
  themeToggle.checked = true;
}

// === Emoji Converter ===
const convertBtn = document.getElementById('convertBtn');
const emojiInput = document.getElementById('emojiInput');
const results = document.getElementById('results');

convertBtn.addEventListener('click', () => {
  const text = emojiInput.value.trim();
  results.innerHTML = '';

  if (!text) {
    results.innerHTML = '<p>Please enter text with emojis!</p>';
    return;
  }

  const emojiRegex = /\p{Emoji_Presentation}|\p{Emoji}\uFE0F/gu;
  const emojis = text.match(emojiRegex);

  if (!emojis) {
    results.innerHTML = '<p>No emojis found.</p>';
    return;
  }

  emojis.forEach(char => {
    const codePoint = char.codePointAt(0).toString(16).toUpperCase();
    const unicode = 'U+' + codePoint.padStart(4, '0');
    const js = `\\u{${codePoint}}`;
    const html = `&#x${codePoint};`;
    const urlEncoded = encodeURIComponent(char);
    const binaryCode = char.codePointAt(0).toString(2);

    // Create result card
    const div = document.createElement('div');
    div.className = 'result';
    div.innerHTML = `
      <h3>${char}</h3>
      <p><strong>Unicode:</strong> ${unicode}</p>
      <p><strong>JavaScript:</strong> ${js}</p>
      <p><strong>HTML:</strong> ${html}</p>
      <p><strong>URL Encoding:</strong> ${urlEncoded}</p>
      <p><strong>Binary:</strong> ${binaryCode}</p>
    `;
    results.appendChild(div);

    // === Console Logging ===
    console.log(`\u{1F50D} Emoji: ${char}`);
    console.log(`• Unicode: ${unicode}`);
    console.log(`• HTML: ${html}`);
    console.log(`• JavaScript: ${js}`);
    console.log(`• URL Encoding: ${urlEncoded}`);
    console.log(`• Binary: ${binaryCode}`);
    console.log("———————————————");
  });
});
