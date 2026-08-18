/* ---------------------------------------------------------
   Sabal — app logic (vanilla JS, in-memory fake data)
   Everything here resets on page refresh — there is no
   backend. See README.md for how to add one.
--------------------------------------------------------- */

// ---------- Icons (inline SVG strings, reused across renders) ----------

const ICONS = {
  heart: (filled) =>
    `<svg viewBox="0 0 24 24" width="24" height="24" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.2 2.1 5 5.4 5c2 0 3.4 1.1 4.1 2.3C10.2 6.1 11.6 5 13.6 5c3.3 0 4.9 3.2 3.4 6.7C19.5 16.4 12 21 12 21Z"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.3 0-2.5-.3-3.6-.8L3 21l1.9-5.2A8.4 8.4 0 0 1 3.5 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/></svg>`,
  send: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  bookmark: (filled) =>
    `<svg viewBox="0 0 24 24" width="22" height="22" fill="${filled ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/></svg>`,
  more: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>`,
};

// ---------- Fake data ----------

let currentUserVersion = 0;

const POSTS = [
  {
    id: 1, user: "wanderlust_mia", color: "#C9A227",
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=80",
    caption: "Got lost in the bamboo grove and honestly didn't want to be found.",
    liked: false, saved: false, likes: 128, time: "3h",
    comments: [
      { user: "theo_k", text: "This light is unreal" },
      { user: "priya.codes", text: "Adding this to my list immediately" },
    ],
  },
  {
    id: 2, user: "theo_k", color: "#4C6B4F",
    location: "Lisbon, Portugal",
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=900&q=80",
    caption: "Tram 28 at golden hour. That's the whole caption.",
    liked: true, saved: false, likes: 342, time: "5h",
    comments: [{ user: "wanderlust_mia", text: "Iconic" }],
  },
  {
    id: 3, user: "priya.codes", color: "#8A5A9E",
    location: "Home studio",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=900&q=80",
    caption: "Three years of debugging led to this one clean deploy. Framed it.",
    liked: false, saved: true, likes: 89, time: "9h",
    comments: [],
  },
  {
    id: 4, user: "mono.marcus", color: "#8C3B2E",
    location: "Reykjavík, Iceland",
    image: "https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=900&q=80",
    caption: "-2°C and worth every second.",
    liked: false, saved: false, likes: 511, time: "1d",
    comments: [{ user: "theo_k", text: "How did you not lose a finger" }],
  },
];

const STORIES = [
  { id: 0, user: "you", color: "#4C6B4F", isYou: true, seen: true,
    slides: [] },
  { id: 1, user: "wanderlust_mia", color: "#C9A227", seen: false,
    slides: ["https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=700&q=80"] },
  { id: 2, user: "theo_k", color: "#4C6B4F", seen: false,
    slides: ["https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=700&q=80",
             "https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=700&q=80"] },
  { id: 3, user: "priya.codes", color: "#8A5A9E", seen: true,
    slides: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&q=80"] },
  { id: 4, user: "mono.marcus", color: "#8C3B2E", seen: false,
    slides: ["https://images.unsplash.com/photo-1516394311936-7d78e9b3e0a1?w=700&q=80"] },
  { id: 5, user: "june.paints", color: "#4C6B4F", seen: false,
    slides: ["https://images.unsplash.com/photo-1500534623283-312aade485b7?w=700&q=80"] },
];

const SUGGESTIONS = [
  { user: "june.paints", color: "#4C6B4F", sub: "Followed by theo_k", following: false },
  { user: "harlan.reads", color: "#C9A227", sub: "New to Sabal", following: false },
  { user: "noor.builds", color: "#8C3B2E", sub: "Followed by priya.codes", following: false },
];

const PRESET_IMAGES = [
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=500&q=80",
  "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=500&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=500&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
];

let nextPostId = POSTS.length + 1;
let activeCommentsPostId = null;
let activeStoryIndex = null;
let activeSlideIndex = 0;
let storyTimer = null;
let selectedCreateImage = null;

// ---------- Helpers ----------

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function initials(name) {
  return name.replace(/[._]/g, " ").trim().slice(0, 1).toUpperCase();
}

function avatarHTML(user, color, size = "sm") {
  return `<span class="avatar avatar--${size}" style="--avatar-color:${color}">${initials(user)}</span>`;
}

// ---------- Render: stories ----------

function renderStories() {
  const track = $("#stories-track");
  track.innerHTML = STORIES.map((s, i) => `
    <button class="story" data-story-index="${i}">
      <span class="avatar-ring ${s.seen && !s.isYou ? "avatar-ring--seen" : ""}">
        ${avatarHTML(s.isYou ? "you" : s.user, s.color, "md")}
      </span>
      <span class="label">${s.isYou ? "Your story" : s.user}</span>
    </button>
  `).join("");

  track.querySelectorAll(".story").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.storyIndex);
      if (STORIES[idx].isYou) return; // no story to view yet
      openStory(idx);
    });
  });
}

// ---------- Render: feed ----------

function postTemplate(post) {
  return `
    <article class="post" data-post-id="${post.id}">
      <div class="post__head">
        <div class="post__user">
          ${avatarHTML(post.user, post.color, "sm")}
          <div>
            <div class="name">${post.user}</div>
            <div class="loc">${post.location}</div>
          </div>
        </div>
        <button class="iconbtn" aria-label="More options">${ICONS.more}</button>
      </div>

      <div class="post__media" data-role="media">
        <img src="${post.image}" alt="${post.caption.replace(/"/g, "&quot;")}" />
        <span class="post__burst" data-role="burst">${ICONS.heart(true)}</span>
      </div>

      <div class="post__actions">
        <div class="post__actions-left">
          <button class="heart ${post.liked ? "is-liked" : ""}" data-role="like" aria-label="${post.liked ? "Unlike" : "Like"}">${ICONS.heart(post.liked)}</button>
          <button data-role="comment" aria-label="Comment">${ICONS.comment}</button>
          <button aria-label="Share">${ICONS.send}</button>
        </div>
        <button class="bookmark ${post.saved ? "is-saved" : ""}" data-role="save" aria-label="${post.saved ? "Unsave" : "Save"}">${ICONS.bookmark(post.saved)}</button>
      </div>

      <div class="post__meta">
        <div class="post__likes" data-role="likecount">${post.likes.toLocaleString()} likes</div>
        <div class="post__caption"><span class="name">${post.user}</span>${post.caption}</div>
        ${post.comments.length > 0 ? `<button class="post__viewcomments" data-role="comment">View all ${post.comments.length} comments</button>` : ""}
        <div class="post__time">${post.time} ago</div>
      </div>
    </article>
  `;
}

function renderFeed() {
  $("#feed").innerHTML = POSTS.map(postTemplate).join("");
  $("#feed").querySelectorAll(".post").forEach(wirePost);
}

function wirePost(el) {
  const id = Number(el.dataset.postId);
  const post = POSTS.find((p) => p.id === id);

  const likeBtn = el.querySelector('[data-role="like"]');
  const saveBtn = el.querySelector('[data-role="save"]');
  const media = el.querySelector('[data-role="media"]');
  const commentTriggers = el.querySelectorAll('[data-role="comment"]');

  likeBtn.addEventListener("click", () => setLiked(post, !post.liked, el));
  saveBtn.addEventListener("click", () => setSaved(post, !post.saved, el));
  commentTriggers.forEach((t) => t.addEventListener("click", () => openComments(post.id)));

  media.addEventListener("dblclick", () => {
    if (!post.liked) setLiked(post, true, el);
    const burst = el.querySelector('[data-role="burst"]');
    burst.classList.remove("is-active");
    void burst.offsetWidth; // restart animation
    burst.classList.add("is-active");
  });
}

function setLiked(post, value, el) {
  post.liked = value;
  post.likes += value ? 1 : -1;
  const btn = el.querySelector('[data-role="like"]');
  btn.classList.toggle("is-liked", value);
  btn.innerHTML = ICONS.heart(value);
  btn.classList.remove("heart-pop");
  void btn.offsetWidth;
  btn.classList.add("heart-pop");
  el.querySelector('[data-role="likecount"]').textContent = `${post.likes.toLocaleString()} likes`;
}

function setSaved(post, value, el) {
  post.saved = value;
  const btn = el.querySelector('[data-role="save"]');
  btn.classList.toggle("is-saved", value);
  btn.innerHTML = ICONS.bookmark(value);
}

// ---------- Render: suggestions ----------

function renderSuggestions() {
  $("#suggestions-list").innerHTML = SUGGESTIONS.map((s, i) => `
    <div class="suggestion">
      ${avatarHTML(s.user, s.color, "sm")}
      <div class="info">
        <div class="name">${s.user}</div>
        <div class="sub">${s.sub}</div>
      </div>
      <button class="follow-btn ${s.following ? "is-following" : ""}" data-index="${i}">
        ${s.following ? "Following" : "Follow"}
      </button>
    </div>
  `).join("");

  $("#suggestions-list").querySelectorAll(".follow-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const s = SUGGESTIONS[Number(btn.dataset.index)];
      s.following = !s.following;
      btn.classList.toggle("is-following", s.following);
      btn.textContent = s.following ? "Following" : "Follow";
    });
  });
}

// ---------- Comments modal ----------

function openComments(postId) {
  activeCommentsPostId = postId;
  renderComments();
  $("#comments-modal").hidden = false;
  $("#comment-input").value = "";
  $("#comment-post").disabled = true;
}

function renderComments() {
  const post = POSTS.find((p) => p.id === activeCommentsPostId);
  const list = $("#comments-list");
  if (!post.comments.length) {
    list.innerHTML = `<p class="sheet__empty">No comments yet. Say something.</p>`;
    return;
  }
  list.innerHTML = post.comments.map((c) => `
    <div class="comment">
      ${avatarHTML(c.user, "#A79E88", "sm")}
      <div><span class="name">${c.user}</span>${c.text}</div>
    </div>
  `).join("");
}

function closeComments() {
  $("#comments-modal").hidden = true;
  activeCommentsPostId = null;
  renderFeed(); // refresh "view all comments" counts
}

function postComment() {
  const input = $("#comment-input");
  const text = input.value.trim();
  if (!text || activeCommentsPostId == null) return;
  const post = POSTS.find((p) => p.id === activeCommentsPostId);
  post.comments.push({ user: "you", text });
  input.value = "";
  $("#comment-post").disabled = true;
  renderComments();
}

// ---------- Story viewer ----------

function openStory(index) {
  activeStoryIndex = index;
  activeSlideIndex = 0;
  $("#story-modal").hidden = false;
  renderStory();
}

function renderStory() {
  const story = STORIES[activeStoryIndex];
  story.seen = true;
  renderStories();

  const avatarEl = $("#story-avatar");
  avatarEl.style.setProperty("--avatar-color", story.color);
  avatarEl.textContent = initials(story.user);
  $("#story-username").textContent = story.user;
  $("#story-time").textContent = "just now";
  $("#story-image").src = story.slides[activeSlideIndex];

  $("#story-bars").innerHTML = story.slides.map((_, i) => `
    <div class="bar ${i < activeSlideIndex ? "is-done" : ""} ${i === activeSlideIndex ? "is-active" : ""}">
      <div class="bar__fill"></div>
    </div>
  `).join("");

  clearTimeout(storyTimer);
  storyTimer = setTimeout(advanceStory, 4000);
}

function advanceStory() {
  const story = STORIES[activeStoryIndex];
  if (activeSlideIndex < story.slides.length - 1) {
    activeSlideIndex++;
    renderStory();
  } else if (activeStoryIndex < STORIES.length - 1) {
    let next = activeStoryIndex + 1;
    if (STORIES[next].isYou) next++;
    if (next < STORIES.length) {
      openStory(next);
    } else {
      closeStory();
    }
  } else {
    closeStory();
  }
}

function closeStory() {
  clearTimeout(storyTimer);
  $("#story-modal").hidden = true;
  activeStoryIndex = null;
}

// ---------- Create post modal ----------

function renderImagePicker() {
  $("#image-picker").innerHTML = PRESET_IMAGES.map((src, i) => `
    <img src="${src}" data-index="${i}" alt="Preset ${i + 1}" />
  `).join("");

  $("#image-picker").querySelectorAll("img").forEach((img) => {
    img.addEventListener("click", () => {
      selectedCreateImage = img.src;
      $("#image-picker").querySelectorAll("img").forEach((i) => i.classList.remove("is-selected"));
      img.classList.add("is-selected");
      updateShareState();
    });
  });
}

function updateShareState() {
  $("#create-share").disabled = !selectedCreateImage;
}

function openCreate() {
  selectedCreateImage = null;
  $("#create-caption").value = "";
  renderImagePicker();
  updateShareState();
  $("#create-modal").hidden = false;
}

function closeCreate() {
  $("#create-modal").hidden = true;
}

function sharePost() {
  if (!selectedCreateImage) return;
  const caption = $("#create-caption").value.trim() || "New post";
  POSTS.unshift({
    id: nextPostId++,
    user: "you",
    color: "#4C6B4F",
    location: "",
    image: selectedCreateImage,
    caption,
    liked: false,
    saved: false,
    likes: 0,
    time: "now",
    comments: [],
  });
  renderFeed();
  closeCreate();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Dropdowns ----------

function toggleDropdown(id) {
  const el = $(id);
  const wasHidden = el.hidden;
  $$(".dropdown").forEach((d) => (d.hidden = true));
  el.hidden = !wasHidden;
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("#profile-dropdown") && !e.target.closest("#btn-profile")) {
    $("#profile-dropdown").hidden = true;
  }
  if (!e.target.closest("#activity-dropdown") && !e.target.closest("#btn-activity") && !e.target.closest("#btn-activity-mobile")) {
    $("#activity-dropdown").hidden = true;
  }
});

// ---------- Wire static controls ----------

function init() {
  renderStories();
  renderFeed();
  renderSuggestions();

  $("#btn-profile").addEventListener("click", (e) => { e.stopPropagation(); toggleDropdown("#profile-dropdown"); });
  $("#btn-activity").addEventListener("click", (e) => { e.stopPropagation(); toggleDropdown("#activity-dropdown"); });
  $("#btn-activity-mobile").addEventListener("click", (e) => { e.stopPropagation(); toggleDropdown("#activity-dropdown"); });

  $("#btn-create").addEventListener("click", openCreate);
  $("#btn-create-mobile").addEventListener("click", openCreate);
  $("#create-close").addEventListener("click", closeCreate);
  $("#create-share").addEventListener("click", sharePost);
  $("#create-caption").addEventListener("input", updateShareState);

  $("#comments-close").addEventListener("click", closeComments);
  $("#comment-input").addEventListener("input", (e) => {
    $("#comment-post").disabled = !e.target.value.trim();
  });
  $("#comment-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") postComment();
  });
  $("#comment-post").addEventListener("click", postComment);

  $("#story-close").addEventListener("click", closeStory);
  $("#story-prev").addEventListener("click", () => {
    if (activeSlideIndex > 0) { activeSlideIndex--; renderStory(); }
  });
  $("#story-next").addEventListener("click", advanceStory);

  // close modals on backdrop click
  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        if (modal.id === "comments-modal") closeComments();
        else if (modal.id === "create-modal") closeCreate();
        else if (modal.id === "story-modal") closeStory();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("#comments-modal").hidden) closeComments();
    if (!$("#create-modal").hidden) closeCreate();
    if (!$("#story-modal").hidden) closeStory();
  });
}

document.addEventListener("DOMContentLoaded", init);
        
