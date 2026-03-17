import { CacheService } from './services/CacheService';
import './style.css';

// 1. Interfaces
interface Post { 
    id: number; 
    title: string; 
    body: string; 
}

interface Comment { 
    id: number; 
    email: string; 
    body: string; 
}

// 2. State & Cache Initialization
const postCache = new CacheService<Post>();
const commentCache = new CacheService<Comment[]>();

let currentId = 1;
let showComments = false;
let isLoading = false;
const MAX_POSTS = 10;
const app = document.querySelector<HTMLDivElement>('#app')!;

/**
 * Core Data Fetching Logic
 * Ensures 1s delay on network fetch, instant load on cache.
 */
async function fetchData() {
    const postKey = `post-${currentId}`;
    const commentKey = `comments-${currentId}`;

    const isPostCached = postCache.has(postKey);
    const isCommentsCached = commentCache.has(commentKey);

    // Only fetch if data is missing from the CacheService
    const needsToFetch = !isPostCached || (showComments && !isCommentsCached);

    if (needsToFetch) {
        isLoading = true;
        render(); // Show the spinner immediately

        // Create promises for the data and the 1s delay
        const postPromise = getPost();
        const commentsPromise = showComments ? getComments() : Promise.resolve([]);
        const delayPromise = new Promise(resolve => setTimeout(resolve, 1000));

        // Wait for data AND the 1s timer to complete in parallel
        const [post, comments] = await Promise.all([postPromise, commentsPromise, delayPromise]);

        isLoading = false;
        render(post, comments);
    } else {
        // DATA EXISTS IN CACHE: Render immediately with 0 delay
        isLoading = false;
        const post = postCache.get(postKey);
        const comments = showComments ? commentCache.get(commentKey) : [];
        render(post, comments || []);
    }
}

/**
 * API Fetchers with Cache Integration
 */
async function getPost(): Promise<Post> {
    const key = `post-${currentId}`;
    let post = postCache.get(key);
    
    if (!post) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${currentId}`);
        post = await res.json();
        postCache.set(key, post!);
    }
    return post!;
}

async function getComments(): Promise<Comment[]> {
    const key = `comments-${currentId}`;
    let comments = commentCache.get(key);
    
    if (!comments) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${currentId}/comments`);
        comments = await res.json();
        commentCache.set(key, comments!);
    }
    return comments!;
}

/**
 * Main UI Renderer
 */
function render(post?: Post, comments: Comment[] = []) {
    app.innerHTML = `
    <header>
      <h1>Post<span>Browser</span></h1>
    </header>

    <main>
      <div class="card"> <div class="post-content-wrapper">
          <span class="post-id">Post #${currentId} of ${MAX_POSTS}</span>
          
          <div class="post-text-area">
            ${isLoading ? `
              <div class="overlay-loader">
                <div class="loader-container">
                  <span class="loader"></span>
                </div>
              </div>
            ` : `
              <h2 class="post-title">${post?.title}</h2>
              <p class="post-body">${post?.body}</p>
            `}
          </div>

          <div class="actions">
            <button class="btn btn-secondary" id="refresh-btn" ${isLoading ? 'disabled' : ''}>
                <span style="font-size: 1.1rem">🔄</span> Refresh
            </button>
            
            ${!showComments && !isLoading ? `
              <button class="btn btn-primary" id="view-comments">View Comments</button>
            ` : ''}
          </div>

          ${showComments && !isLoading ? `
            <div class="comments-section">
              <h3 style="margin-bottom: 1.2rem; font-family: 'Outfit', sans-serif;">Recent Comments</h3>
              ${comments.slice(0, 5).map(c => `
                <div class="comment">
                  <div class="comment-author">${c.email}</div>
                  <div class="comment-body">${c.body}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="nav-controls">
            <button class="btn btn-secondary" id="prev-btn" ${currentId <= 1 || isLoading ? 'disabled' : ''}>
              ← Previous
            </button>
            <button class="btn btn-secondary" id="next-btn" ${currentId >= MAX_POSTS || isLoading ? 'disabled' : ''}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer>© 2026 Post Browser App</footer>
  `;

    attachListeners();
}

/**
 * Event Listener Hub
 */
function attachListeners() {
    // Next Logic: Max boundary check
    document.getElementById('next-btn')?.addEventListener('click', () => { 
        if (currentId < MAX_POSTS) {
            currentId++; 
            showComments = false; 
            fetchData(); 
        }
    });

    // Previous Logic: Min boundary check (Prevents going to 0 or negative)
    document.getElementById('prev-btn')?.addEventListener('click', () => { 
        if (currentId > 1) {
            currentId--; 
            showComments = false; 
            fetchData(); 
        }
    });

    // Toggle Comments
    document.getElementById('view-comments')?.addEventListener('click', () => { 
        showComments = true; 
        fetchData(); 
    });

    // Refresh: Clear current cache and trigger 1s load
    document.getElementById('refresh-btn')?.addEventListener('click', () => {
        postCache.delete(`post-${currentId}`);
        commentCache.delete(`comments-${currentId}`);
        fetchData(); 
    });
}

// Initial Boot
fetchData();