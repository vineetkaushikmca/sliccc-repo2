/*
 * Copyright 2024 Adobe. All rights reserved.
 */

// Auto-generated block loading
const defined = {};

function sampleRUM(event, data) {}

function setup() {
  window.hlx = window.hlx || {};
  window.hlx.RUM_MASK_URL = 'full';
  window.hlx.codeBasePath = '';
  window.hlx.lighthouse = new URLSearchParams(window.location.search).get('lighthouse') === 'on';
}

function toClassName(name) {
  return typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : '';
}

function createOptimizedPicture(src, alt = '', eager = false, breakpoints = [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]) {
  const url = new URL(src, window.location.href);
  const picture = document.createElement('picture');
  breakpoints.forEach((br) => {
    const source = document.createElement('source');
    if (br.media) source.setAttribute('media', br.media);
    source.setAttribute('type', 'image/webp');
    source.setAttribute('srcset', `${url.pathname}?width=${br.width}&format=webply&optimize=medium`);
    picture.appendChild(source);
  });
  const img = document.createElement('img');
  img.setAttribute('loading', eager ? 'eager' : 'lazy');
  img.setAttribute('alt', alt);
  img.setAttribute('src', `${url.pathname}?width=${breakpoints[breakpoints.length - 1].width}&format=png&optimize=medium`);
  picture.appendChild(img);
  return picture;
}

function decorateBlock(block) {
  const shortBlockName = block.classList[0];
  if (shortBlockName) {
    block.classList.add('block');
    block.dataset.blockName = shortBlockName;
    block.dataset.blockStatus = 'initialized';
    const blockWrapper = block.parentElement;
    blockWrapper.classList.add(`${shortBlockName}-wrapper`);
    const section = block.closest('.section');
    if (section) section.classList.add(`${shortBlockName}-container`);
  }
}

function decorateButtons(element) {
  element.querySelectorAll('a').forEach((a) => {
    a.title = a.title || a.textContent;
    if (a.href !== a.textContent) {
      const up = a.parentElement;
      const twoup = a.parentElement.parentElement;
      if (!a.querySelector('img')) {
        if (up.childNodes.length === 1 && (up.tagName === 'P' || up.tagName === 'DIV')) {
          a.className = 'button primary';
          up.classList.add('button-container');
        }
        if (up.childNodes.length === 1 && up.tagName === 'STRONG' && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'button primary';
          twoup.classList.add('button-container');
        }
        if (up.childNodes.length === 1 && up.tagName === 'EM' && twoup.childNodes.length === 1 && twoup.tagName === 'P') {
          a.className = 'button secondary';
          twoup.classList.add('button-container');
        }
      }
    }
  });
}

function decorateIcons(element) {
  const icons = [...element.querySelectorAll('span.icon')];
  icons.forEach(async (span) => {
    if (span.classList.length < 2) return;
    const icon = span.classList[1].replace('icon-', '');
    const resp = await fetch(`/icons/${icon}.svg`);
    if (resp.ok) {
      const svg = await resp.text();
      span.innerHTML = svg;
    }
  });
}

function decorateSections(main) {
  main.querySelectorAll(':scope > div').forEach((section) => {
    const wrappers = [];
    let defaultContent = false;
    [...section.children].forEach((child) => {
      if (child.tagName === 'DIV' && child.classList.length > 0) {
        // Block
        if (defaultContent) {
          defaultContent = false;
        }
        const wrapper = document.createElement('div');
        wrapper.append(child);
        wrappers.push(wrapper);
      } else {
        // Default content
        if (!defaultContent) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('default-content-wrapper');
          wrappers.push(wrapper);
          defaultContent = true;
        }
        wrappers[wrappers.length - 1].append(child);
      }
    });
    wrappers.forEach((wrapper) => section.append(wrapper));
    section.classList.add('section');

    // Handle section metadata
    const sectionMeta = section.querySelector('div.section-metadata');
    if (sectionMeta) {
      const meta = {};
      sectionMeta.querySelectorAll(':scope > div').forEach((row) => {
        const key = row.children[0]?.textContent?.trim().toLowerCase();
        const value = row.children[1]?.textContent?.trim();
        if (key && value) meta[key] = value;
      });
      Object.entries(meta).forEach(([key, value]) => {
        if (key === 'style') section.classList.add(...value.split(',').map((s) => toClassName(s.trim())));
        else section.dataset[key] = value;
      });
      sectionMeta.parentElement.remove();
    }
  });
}

function decorateBlocks(main) {
  main.querySelectorAll(':scope > div > div[class]').forEach(decorateBlock);
}

async function loadBlock(block) {
  const status = block.dataset.blockStatus;
  if (status !== 'initialized') return block;
  block.dataset.blockStatus = 'loading';
  const blockName = block.dataset.blockName;
  try {
    const cssLoaded = new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/blocks/${blockName}/${blockName}.css`;
      link.onload = resolve;
      link.onerror = resolve;
      document.head.appendChild(link);
    });
    const decorationComplete = new Promise((resolve) => {
      (async () => {
        try {
          const mod = await import(`/blocks/${blockName}/${blockName}.js`);
          if (mod.default) await mod.default(block);
        } catch (error) {
          // Block JS not found — that's fine
        }
        resolve();
      })();
    });
    await Promise.all([cssLoaded, decorationComplete]);
  } catch (error) {
    // Block loading failed silently
  }
  block.dataset.blockStatus = 'loaded';
  return block;
}

async function loadBlocks(main) {
  const blocks = [...main.querySelectorAll('div.block')];
  for (let i = 0; i < blocks.length; i += 1) {
    await loadBlock(blocks[i]);
  }
}

function buildAutoBlocks() {
  // No auto-blocks for now
}

function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateMain(doc.querySelector('main'));
  await loadBlocks(doc.querySelector('main'));
}

async function loadLazy(doc) {
  const main = doc.querySelector('main');
  const { hash } = window.location;
  if (hash) {
    const element = doc.getElementById(hash.substring(1));
    if (element) element.scrollIntoView();
  }
  // Load header + footer
  const header = doc.querySelector('header');
  const footer = doc.querySelector('footer');
  // Minimal header/footer
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
}

setup();
loadPage();

export {
  createOptimizedPicture,
  decorateBlock,
  decorateBlocks,
  decorateButtons,
  decorateIcons,
  decorateMain,
  decorateSections,
  loadBlock,
  loadBlocks,
  sampleRUM,
  toClassName,
};
