/**
 * DataShield Blog JavaScript
 * Provides enhanced functionality for the blog page
 */

// Share functionality
function shareBlogPost(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support the Web Share API
        const shareDialog = document.createElement('div');
        shareDialog.className = 'share-dialog';
        shareDialog.innerHTML = `
            <div class="share-dialog-content">
                <h3>Share this article</h3>
                <div class="share-options">
                    <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-twitter"></i> Twitter
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-facebook"></i> Facebook
                    </a>
                    <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this article: ' + url)}">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                </div>
                <button class="close-dialog">Close</button>
            </div>
        `;
        
        document.body.appendChild(shareDialog);
        
        // Add event listener to close button
        shareDialog.querySelector('.close-dialog').addEventListener('click', function() {
            document.body.removeChild(shareDialog);
        });
        
        // Close when clicking outside the dialog
        shareDialog.addEventListener('click', function(event) {
            if (event.target === shareDialog) {
                document.body.removeChild(shareDialog);
            }
        });
    }
}

// Reading time calculator
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
}

// Add reading time to blog posts
function addReadingTimeToArticles() {
    const articles = document.querySelectorAll('.blog-post');
    
    articles.forEach(article => {
        const content = article.querySelector('.card-text').textContent;
        const readingTime = calculateReadingTime(content);
        
        const timeElement = document.createElement('small');
        timeElement.className = 'text-muted d-block mt-2';
        timeElement.innerHTML = `<i class="far fa-clock me-1"></i> ${readingTime} min read`;
        
        article.querySelector('.card-body').appendChild(timeElement);
    });
}

// Related posts functionality
function showRelatedPosts(category) {
    const relatedPostsContainer = document.getElementById('related-posts');
    if (!relatedPostsContainer) return;
    
    // In a real application, this would fetch related posts from the server
    // For this demo, we'll simulate it with existing posts
    const allPosts = document.querySelectorAll('.blog-post');
    const relatedPosts = Array.from(allPosts)
        .filter(post => post.getAttribute('data-category') === category)
        .slice(0, 3); // Get up to 3 related posts
    
    if (relatedPosts.length > 0) {
        let html = '<div class="row g-4">';
        
        relatedPosts.forEach(post => {
            const title = post.querySelector('.card-title').textContent;
            const image = post.querySelector('img').src;
            
            html += `
                <div class="col-md-4">
                    <div class="card h-100 border-0 shadow-sm">
                        <img src="${image}" class="card-img-top" alt="${title}">
                        <div class="card-body p-3">
                            <h5 class="card-title h6">${title}</h5>
                            <a href="#" class="btn btn-sm btn-link p-0">Read More</a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        relatedPostsContainer.innerHTML = html;
    }
}

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add reading time to articles
    addReadingTimeToArticles();
    
    // Initialize share buttons
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.getAttribute('data-title');
            const url = this.getAttribute('data-url') || window.location.href;
            shareBlogPost(title, url);
        });
    });
    
    // Show related posts if on a single post page
    const currentCategory = document.querySelector('.blog-post-single')?.getAttribute('data-category');
    if (currentCategory) {
        showRelatedPosts(currentCategory);
    }
    
    // Add smooth scrolling to comment section
    const commentLinks = document.querySelectorAll('a[href="#comments"]');
    commentLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('#comments').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 