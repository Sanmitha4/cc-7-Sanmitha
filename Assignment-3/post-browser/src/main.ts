import { CacheService } from './services/CacheService';
import { delay } from './delay';
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
let isLoading = false;
const MAX_POSTS = 10;
const app = document.querySelector<HTMLDivElement>('#app')!;

/**
 * API Fetchers
 */
async function getPost(): Promise<Post> {
    const key = `post-${currentId}`;
    let post = postCache.get(key);
    
    if (!post) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${currentId}`);
        if (!res.ok) throw new Error();
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
        if (!res.ok) throw new Error();
        comments = await res.json();
        commentCache.set(key, comments!);
    }
    return comments!;
}

/**
 * Separate Renderers
 * Addressing: "render posts and comments separately"
 */

function renderPost(post?: Post) {
    app.innerHTML = `
    <header>
      <h1>Post<span>Browser</span></h1>
    </header>

    <main>
      <div class="card">
        <div class="post-content-wrapper">
          <span class="post-id">Post #${currentId} of ${MAX_POSTS}</span>
          
          <div class="post-text-area">
            ${isLoading ? `
              <div class="overlay-loader">
                <div class="loader-container"><span class="loader"></span></div>
              </div>
            ` : `
              <h2 class="post-title">${post?.title || ''}</h2>
              <p class="post-body">${post?.body || ''}</p>
            `}
          </div>

          <div class="actions">
            <button class="btn btn-secondary" id="refresh-btn" ${isLoading ? 'disabled' : ''}>
                <span style="font-size: 1.1rem">🔄</span> Refresh
            </button>
            
            ${!isLoading ? `
              <button class="btn btn-primary" id="view-comments">View Comments</button>
            ` : ''}
          </div>

          <div id="comments-container"></div>

          <div class="nav-controls">
            <button class="btn btn-secondary" id="prev-btn" ${currentId <= 1 || isLoading ? 'disabled' : ''}>← Previous</button>
            <button class="btn btn-secondary" id="next-btn" ${currentId >= MAX_POSTS || isLoading ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
      </div>
    </main>
    <footer>© 2026 Post Browser App</footer>
  `;

    // Re-bind listeners after DOM update
    bindEventListeners();
}

function renderComments(comments: Comment[]) {
    const container = document.getElementById('comments-container');
    if (!container) return;

    container.innerHTML = `
        <div class="comments-section">
          <h3 style="margin-bottom: 1.2rem; font-family: 'Outfit', sans-serif;">Recent Comments</h3>
          ${comments.slice(0, 5).map(c => `
            <div class="comment">
              <div class="comment-author">${c.email}</div>
              <div class="comment-body">${c.body}</div>
            </div>
          `).join('')}
        </div>
    `;
    
    // Hide the view button once comments are rendered
    document.getElementById('view-comments')?.style.setProperty('display', 'none');
}

/**
 * Individual Event Listeners
 */
function bindEventListeners() {
    document.getElementById('next-btn')?.addEventListener('click', () => {
        if (currentId < MAX_POSTS) {
            currentId++;
            fetchData();
        }
    });

    document.getElementById('prev-btn')?.addEventListener('click', () => {
        if (currentId > 1) {
            currentId--;
            fetchData();
        }
    });
    document.getElementById('refresh-btn')?.addEventListener('click', () => {
        postCache.clear();
        commentCache.clear();
        currentId = 1;
        fetchData();
    });
    // Addressing: "comments should be fetched only when needed"
    document.getElementById('view-comments')?.addEventListener('click', async (e) => {
        const btn = e.currentTarget as HTMLButtonElement;
        btn.disabled = true;
        btn.innerText = "Loading...";

        try {
            const comments = await getComments();
            renderComments(comments);
        } catch {
            btn.innerText = "Error loading comments";
            btn.disabled = false;
        }
    });
}

/**
 * Core Data Fetching Logic (Initial Page Load)
 */
async function fetchData() {
    const postKey = `post-${currentId}`;
    const cachedPost = postCache.get(postKey);

    if (!cachedPost) {
        isLoading = true;
        renderPost(); 

        try {
            //  " implemented delay method"
            const [post] = await Promise.all([getPost(), delay(1000)]);
            isLoading = false;
            renderPost(post);
        } catch {
            isLoading = false;
            app.innerHTML = `<div class="error">Failed to load data. Please try again.</div>`;
        }
    } else {
        isLoading = false;
        renderPost(cachedPost);
    }
}

// Initial Boot
fetchData();