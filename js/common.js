/**
 * IGC2 Common Script
 */
const VIDEO_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22120%22%20height%3D%2267%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%2067%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22120%22%20height%3D%2267%22%20fill%3D%22%23cccccc%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dy%3D%22.3em%22%20text-anchor%3D%22middle%22%20fill%3D%22%23555%22%3EVIDEO%3C%2Ftext%3E%3C%2Fsvg%3E";

class LayoutManager {
  constructor() {
    this.isMenuOpen = false;
    this.cssActiveClass = "-active";

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.renderHeader();
    this.bindEvents();
    this.initMedia();
    this.handlePageLoad();
  }

  renderHeader() {
    const nowYear = 2025;
    const years = Array.from({ length: nowYear - 2018 + 1 }, (_, i) => nowYear - i);
    const yearLinks = years.map((y) => `<li><a href="/works/${y}.html" class="accordion__link">${y}</a></li>`).join("");

    const navFooterHTML = `
      <div class="global-navigation__footer">
        <div class="nav-footer-logo">
          <a href="/index.html">
            <img src="/img/IGC2_logo_shadow_128.webp" alt="IGC2 Logo">
          </a>
        </div>
        <p class="nav-footer-text">IGC² ${nowYear}</p>
      </div>
    `;

    const headerHTML = `
      <header class="header">
        <div class="header__inner">
          <button id="js-hamburger" type="button" class="hamburger" aria-controls="navigation" aria-expanded="false" aria-label="メニューを開く">
            <span class="hamburger__line"></span>
            <span class="hamburger__cross"></span> <span class="hamburger__text"></span>
          </button>
          <div class="header__nav-area js-nav-area" id="navigation">
            <nav id="js-global-navigation" class="global-navigation">
              <ul class="global-navigation__list">
                <li><a href="/index.html" class="global-navigation__link">TOP</a></li>
                <li><a href="/about.html" class="global-navigation__link">IGC²とは？</a></li>
                <li>
                  <button type="button" class="global-navigation__link -accordion js-sp-accordion-trigger" aria-expanded="false" aria-controls="accordion1">制作物</button>
                  <div id="accordion1" class="accordion js-accordion">
                    <ul class="accordion__list">
                      <li><a href="/works/recommend.html" class="accordion__link">厳選作品</a></li>
                      ${yearLinks}
                    </ul>
                  </div>
                </li>
                <li><a href="/faq.html" class="global-navigation__link">FAQ</a></li>
                <li><a href="/contact.html" class="global-navigation__link">入会希望・コンタクト</a></li>
              </ul>
              ${navFooterHTML} <div id="js-focus-trap" tabindex="0"></div>
            </nav>
          </div>
        </div>
      </header>`;

    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  }

  bindEvents() {
    this.hamburgerBtn = document.getElementById("js-hamburger");
    this.menuArea = document.querySelector(".js-nav-area");
    this.focusTrap = document.getElementById("js-focus-trap");

    if (!this.hamburgerBtn || !this.menuArea) return;

    // ハンバーガーメニュー
    this.hamburgerBtn.addEventListener("click", (e) => this.toggleMenu(e.currentTarget));

    // メニュー外クリック・Escapeキー
    document.addEventListener("click", (e) => {
      if (this.isMenuOpen && !this.menuArea.contains(e.target) && !this.hamburgerBtn.contains(e.target)) {
        this.closeMenu();
      }
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) this.closeMenu();
    });

    // アコーディオン
    document.querySelectorAll(".js-sp-accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        const target = e.currentTarget;
        const isActive = target.classList.toggle(this.cssActiveClass);
        target.nextElementSibling?.classList.toggle(this.cssActiveClass);
        target.setAttribute("aria-expanded", isActive ? "true" : "false");
      });
    });

    this.focusTrap?.addEventListener("focus", () => this.hamburgerBtn.focus());
  }

  toggleMenu(button) {
    this.isMenuOpen = !this.isMenuOpen;
    button.classList.toggle(this.cssActiveClass);
    this.menuArea.classList.toggle(this.cssActiveClass);
    button.setAttribute("aria-expanded", String(this.isMenuOpen));
    this.setBodyScroll(!this.isMenuOpen);
  }

  closeMenu() {
    this.isMenuOpen = false;
    this.hamburgerBtn.classList.remove(this.cssActiveClass);
    this.menuArea.classList.remove(this.cssActiveClass);
    this.hamburgerBtn.setAttribute("aria-expanded", "false");
    this.setBodyScroll(true);
    this.hamburgerBtn.focus();
  }

  setBodyScroll(enable) {
    const val = enable ? "" : "hidden";
    document.body.style.overflow = val;
    document.documentElement.style.overflow = val;
  }

  initMedia() {
    document.querySelectorAll(".work-card").forEach((card) => {
      const galleryEl = card.querySelector(".work-gallery");
      if (!galleryEl) return;

      const mediaList = this.extractMediaData(galleryEl);
      if (mediaList.length === 0) return;

      const wrapper = document.createElement("div");
      wrapper.className = "gallery-wrapper";

      // DOM置き換え
      galleryEl.parentNode.replaceChild(wrapper, galleryEl);
      this.buildGalleryDOM(wrapper, mediaList);
    });
  }

  extractMediaData(galleryEl) {
    const list = [];
    Array.from(galleryEl.children).forEach((child) => {
      if (child.tagName === "IMG") {
        list.push({ type: "image", src: child.src, alt: child.alt });
      } else if (child.classList.contains("js-work-video")) {
        const url = child.textContent.trim().replace(/"/g, "");
        const info = url ? this.parseVideoUrl(url) : null;
        if (info) {
          list.push({
            type: info.service,
            src: info.embedUrl,
            id: info.id,
            thumb: child.getAttribute("data-thumb"),
          });
        }
      }
    });
    return list;
  }

  buildGalleryDOM(wrapper, mediaList) {
    // メインビュー生成
    const mainView = document.createElement("div");
    mainView.className = "gallery-main-view";

    const mainItems = mediaList.map((media, i) => {
      const item = document.createElement("div");
      item.className = "gallery-main-item";
      Object.assign(item.style, { width: "100%", height: "100%", display: i === 0 ? "block" : "none" });

      if (media.type === "image") {
        const img = document.createElement("img");
        img.src = media.src;
        img.alt = media.alt;
        item.appendChild(img);
      } else if (media.type === "youtube") {
        const iframe = document.createElement("iframe");
        iframe.src = media.src;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        item.appendChild(iframe);
      }
      mainView.appendChild(item);
      return item;
    });
    wrapper.appendChild(mainView);

    // サムネイル生成（複数時のみ）
    if (mediaList.length > 1) {
      this.buildThumbnailNav(wrapper, mediaList, mainItems);
    }
  }

  buildThumbnailNav(wrapper, mediaList, mainItems) {
    const navContainer = document.createElement("div");
    navContainer.className = "thumbs-nav-container";

    const thumbArea = document.createElement("div");
    thumbArea.className = "gallery-thumbnails";

    // 左右ボタン
    const createBtn = (cls, txt, dir) => {
      const btn = document.createElement("button");
      btn.className = `nav-arrow ${cls}`;
      btn.textContent = txt;
      btn.onclick = () => thumbArea.scrollBy({ left: dir * 130, behavior: "smooth" });
      return btn;
    };
    const prevBtn = createBtn("-prev", "‹", -1);
    const nextBtn = createBtn("-next", "›", 1);

    // サムネイルアイテム
    mediaList.forEach((media, i) => {
      const thumb = document.createElement("div");
      thumb.className = `thumb-item ${i === 0 ? "-selected" : ""}`;

      const img = document.createElement("img");
      if (media.type === "image") {
        img.src = media.src;
      } else {
        img.src = media.thumb || VIDEO_PLACEHOLDER;
        thumb.classList.add("-video");
      }
      img.alt = "thumbnail";

      thumb.appendChild(img);
      thumb.addEventListener("click", () => {
        mainItems.forEach((el) => (el.style.display = "none"));
        mainItems[i].style.display = "block";
        thumbArea.querySelectorAll(".thumb-item").forEach((t) => t.classList.remove("-selected"));
        thumb.classList.add("-selected");
      });
      thumbArea.appendChild(thumb);
    });

    navContainer.append(prevBtn, thumbArea, nextBtn);
    wrapper.appendChild(navContainer);

    // オーバーフロー判定
    const checkOverflow = () => {
      const isOverflow = thumbArea.scrollWidth > thumbArea.clientWidth + 1;
      const display = isOverflow ? "flex" : "none";
      prevBtn.style.display = display;
      nextBtn.style.display = display;
      navContainer.classList.toggle("-no-scroll", !isOverflow);
    };

    setTimeout(checkOverflow, 100);
    window.addEventListener("resize", checkOverflow);
    thumbArea.querySelectorAll("img").forEach((img) => img.addEventListener("load", checkOverflow));
  }

  parseVideoUrl(url) {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    return match && match[2].length === 11 ? { service: "youtube", id: match[2], embedUrl: `https://www.youtube.com/embed/${match[2]}` } : null;
  }

  handlePageLoad() {
    const onLoaded = () => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          document.body.classList.add("loaded");
          document.querySelector("header")?.classList.add("loaded");
          document.querySelector("main")?.classList.add("loaded");
        });
      }, 300);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onLoaded);
    } else {
      onLoaded();
    }
  }

}

new LayoutManager();
