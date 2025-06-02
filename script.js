// script.js
let articles = [];
let currentTheme = localStorage.getItem('theme') || 'light';
document.body.className = currentTheme;
document.getElementById('theme-toggle').textContent = currentTheme === 'light' ? '🌙' : '☀️';

function toggleTheme() {
  const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
  document.getElementById('theme-toggle').textContent = newTheme === 'light' ? '🌙' : '☀️';
}

async function fetchArticles() {
  try {
    const res = await fetch('articles.json');
    const data = await res.json();
    articles = data.articles;
    displayArticles();
    showMostPopular();
  } catch (error) {
    console.error("Error loading articles:", error);
  }
}

function displayArticles() {
  const container = document.getElementById('news-container');
  container.innerHTML = '';
  articles.forEach(article => {
    const minutes = Math.ceil(article.wordCount / 200);
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="card shadow-sm h-100 article-card" data-id="${article.id}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${article.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${article.date} | ${article.category}</h6>
          <p class="card-text flex-grow-1">${article.content.slice(0, 100)}...</p>
          <p class="text-muted small mt-2">Views: ${article.views} | ${minutes} min read</p>
        </div>
      </div>`;
    container.appendChild(card);
  });
  addArticleClickListeners();
}

function addArticleClickListeners() {
  document.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const article = articles.find(a => a.id == id);
      if (article) {
        article.views += 1;
        const viewsText = card.querySelector('.text-muted.small');
        const minutes = Math.ceil(article.wordCount / 200);
        viewsText.textContent = Views: ${article.views} | ${minutes} min read;
        document.getElementById('articleModalLabel').textContent = article.title;
        document.getElementById('articleModalContent').textContent = article.content;
        const modal = new bootstrap.Modal(document.getElementById('articleModal'));
        modal.show();
        showMostPopular();
      }
    });
  });
}
function sortArticles() {
  const sortBy = document.getElementById('sort-select').value;
  articles.sort((a, b) => sortBy === 'views' ? b.views - a.views : new Date(b.date) - new Date(a.date));
  displayArticles();
  showMostPopular();
}

function showMostPopular() {
  const top = articles.reduce((a, b) => a.views > b.views ? a : b);
  const minutes = Math.ceil(top.wordCount / 200);
  document.getElementById('popular-article').innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${top.title}</h5>
      <p class="card-text">${top.content.slice(0, 150)}...</p>
      <p class="text-muted small">Views: ${top.views} | ${minutes} min read</p>
    </div>`;
}

fetchArticles();
