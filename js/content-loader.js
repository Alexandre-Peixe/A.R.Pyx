// ========================================
// Content Management System
// Loads content from JSON files and populates the page
// ========================================

class ContentLoader {
  constructor() {
    this.content = {};
    this.contentFiles = [
      'content/metadata.json',
      'content/hero.json',
      'content/book.json',
      'content/characters.json',
      'content/novella.json',
      'content/author.json',
      'content/newsletter.json',
      'content/ui.json'
    ];
  }

  async init() {
    try {
      await this.loadAllContent();
      this.populateContent();
      this.populateArrayContent();
      this.populateCharacters();
      this.updateSEO();
      console.log('Content loaded successfully');
    } catch (error) {
      console.error('Error loading content:', error);
      this.handleContentLoadError();
    }
  }

  async loadAllContent() {
    const promises = this.contentFiles.map(file => this.loadContentFile(file));
    const results = await Promise.all(promises);
    
    // Merge all content objects
    results.forEach(content => {
      Object.assign(this.content, content);
    });
  }

  async loadContentFile(filename) {
    try {
      const response = await fetch(filename);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Could not load ${filename}:`, error);
      return {};
    }
  }

  populateContent() {
    // Populate single text elements
    const elements = document.querySelectorAll('[data-content]');
    elements.forEach(element => {
      const contentPath = element.getAttribute('data-content');
      const content = this.getNestedProperty(this.content, contentPath);
      
      if (content) {
        if (element.tagName === 'META') {
          element.setAttribute('content', content);
        } else if (element.tagName === 'TITLE') {
          element.textContent = content;
        } else {
          element.textContent = content;
        }
      }
    });
  }

  populateArrayContent() {
    // Populate array content (multiple paragraphs, lists)
    const arrayElements = document.querySelectorAll('[data-content-array]');
    arrayElements.forEach(element => {
      const contentPath = element.getAttribute('data-content-array');
      const contentArray = this.getNestedProperty(this.content, contentPath);
      
      if (contentArray && Array.isArray(contentArray)) {
        if (element.tagName === 'UL') {
          // For lists
          element.innerHTML = contentArray.map(item => `<li>${item}</li>`).join('');
        } else {
          // For paragraph containers
          element.innerHTML = contentArray.map(text => `<p>${text}</p>`).join('');
        }
      }
    });
  }

  populateCharacters() {
    const charactersGrid = document.getElementById('characters-grid');
    const characters = this.content.characters?.list;
    
    if (charactersGrid && characters && Array.isArray(characters)) {
      charactersGrid.innerHTML = characters.map(character => `
        <article class="char-card">
          <div class="char-img-wrapper">
            <img src="${character.image}" alt="Portrait of ${character.name}" loading="lazy" width="260" height="320">
          </div>
          <div class="char-info">
            <h3>${character.name}</h3>
            <p>${character.tagline}</p>
          </div>
        </article>
      `).join('');
    }
  }

  updateSEO() {
    // Update structured data if needed
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    if (structuredData && this.content.seo?.structuredData) {
      structuredData.textContent = JSON.stringify(this.content.seo.structuredData, null, 2);
    }
  }

  getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
  }

  handleContentLoadError() {
    // Fallback: hide loading placeholders and show error message
    const placeholders = document.querySelectorAll('.loading-placeholder');
    placeholders.forEach(placeholder => {
      placeholder.textContent = 'Content temporarily unavailable';
      placeholder.style.opacity = '0.6';
    });
  }
}

// Initialize content loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const contentLoader = new ContentLoader();
  contentLoader.init();
});