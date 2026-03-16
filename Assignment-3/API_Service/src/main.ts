// import './style.css'
// import typescriptLogo from './assets/typescript.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
// <section id="center">
//   <div class="hero">
//     <img src="${heroImg}" class="base" width="170" height="179">
//     <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
//     <img src=${viteLogo} class="vite" alt="Vite logo" />
//   </div>
//   <div>
//     <h1>Get started</h1>
//     <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
//   </div>
//   <button id="counter" type="button" class="counter"></button>
// </section>

// <div class="ticks"></div>

// <section id="next-steps">
//   <div id="docs">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#documentation-icon"></use></svg>
//     <h2>Documentation</h2>
//     <p>Your questions, answered</p>
//     <ul>
//       <li>
//         <a href="https://vite.dev/" target="_blank">
//           <img class="logo" src=${viteLogo} alt="" />
//           Explore Vite
//         </a>
//       </li>
//       <li>
//         <a href="https://www.typescriptlang.org" target="_blank">
//           <img class="button-icon" src="${typescriptLogo}" alt="">
//           Learn more
//         </a>
//       </li>
//     </ul>
//   </div>
//   <div id="social">
//     <svg class="icon" role="presentation" aria-hidden="true"><use href="/icons.svg#social-icon"></use></svg>
//     <h2>Connect with us</h2>
//     <p>Join the Vite community</p>
//     <ul>
//       <li><a href="https://github.com/vitejs/vite" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#github-icon"></use></svg>GitHub</a></li>
//       <li><a href="https://chat.vite.dev/" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#discord-icon"></use></svg>Discord</a></li>
//       <li><a href="https://x.com/vite_js" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#x-icon"></use></svg>X.com</a></li>
//       <li><a href="https://bsky.app/profile/vite.dev" target="_blank"><svg class="button-icon" role="presentation" aria-hidden="true"><use href="/icons.svg#bluesky-icon"></use></svg>Bluesky</a></li>
//     </ul>
//   </div>
// </section>

// <div class="ticks"></div>
// <section id="spacer"></section>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
import "./style.css";
import { APIService, Post, Comment } from "./APIService";
import { CacheService } from "./CacheService";

// Initialize Services
const api = new APIService();
const postCache = new CacheService<Post>();
const commentCache = new CacheService<Comment[]>();

const postListContainer = document.getElementById("post-list")!;
const mainView = document.getElementById("main-view")!;

/**
 * Initializes the sidebar with the first 10 posts
 */
async function initApp() {
  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts?_limit=10",
    );
    const posts: Post[] = await response.json();

    postListContainer.innerHTML = posts
      .map(
        (post) => `
      <div class="post-link" data-id="${post.id}">
        ${post.title}
      </div>
    `,
      )
      .join("");

    // Event Delegation for clicks
    postListContainer.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("post-link")) {
        const postId = parseInt(target.getAttribute("data-id")!);
        handlePostSelection(postId, target);
      }
    });
  } catch (error) {
    console.error("Initialization Error:", error); // Use the variable!
    postListContainer.innerHTML = '<p class="error">Failed to load posts.</p>';
  }
}

/**
 * Handles the logic for selecting a post, caching, and rendering
 */
async function handlePostSelection(id: number, element: HTMLElement) {
  // 1. UI: Update Active State
  document
    .querySelectorAll(".post-link")
    .forEach((el) => el.classList.remove("active"));
  element.classList.add("active");

  // 2. UI: Show Loading
  mainView.innerHTML = '<div class="loader">Loading details...</div>';

  try {
    let post: Post;
    let comments: Comment[];

    // 3. Logic: Check Cache first
    if (postCache.has(id) && commentCache.has(id)) {
      post = postCache.get(id)!;
      comments = commentCache.get(id)!;
    } else {
      // 4. Logic: Fetch and Store in Cache
      [post, comments] = await Promise.all([
        api.fetchPost(id),
        api.fetchComments(id, 5),
      ]);
      postCache.set(id, post);
      commentCache.set(id, comments);
    }

    // 5. UI: Render Main View
    renderPostContent(post, comments);
  } catch (error) {
    console.error("Initialization Error:", error); // Use the variable!
    postListContainer.innerHTML = '<p class="error">Failed to load posts.</p>';
  }
}

function renderPostContent(post: Post, comments: Comment[]) {
  mainView.innerHTML = `
    <article class="post-content">
      <h1>${post.title}</h1>
      <p class="post-body">${post.body}</p>
      <section class="comments-section">
        <h3>Comments</h3>
        ${comments
          .map(
            (c) => `
          <div class="comment">
            <p><strong>${c.name}</strong> <small>(${c.email})</small></p>
            <p>${c.body}</p>
          </div>
        `,
          )
          .join("")}
      </section>
    </article>
  `;
}

initApp();
