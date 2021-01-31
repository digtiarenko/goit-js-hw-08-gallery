import gallery from './gallery-items.js';

const galleryRef = document.querySelector('.gallery.js-gallery');
const modalRef = document.querySelector('.lightbox.js-lightbox');
const modalImageRef = document.querySelector('.lightbox__image');
const modalContentDivRef = document.querySelector('.lightbox__content');
const overlayRef = document.querySelector('.lightbox__overlay');
const closeBtn = document.querySelector('button[data-action="close-lightbox"]');

// Створюємо розмітку для галереї через insertAdjacentHTML
// const galleryHtml = gallery
//   .map(picture => {
//     const img = `<li class="gallery__item">
//       <a class="gallery__link" href="${picture.original}">
//       <img class="gallery__image"
//       src="${picture.preview}"
//       data-source="${picture.original}"
//       alt="${picture.description}"/></a></li>`;
//     return img;
//   })
//   .join('');
// galleryRef.insertAdjacentHTML('afterbegin', galleryHtml);
// Створюємо розмітку для галереї через createElement
let currentIndex;
let maxIndex = gallery.length - 1;

const galleryHtml = gallery.map(picture => {
  const li = document.createElement('li');
  const a = document.createElement('a');
  const img = document.createElement('img');

  li.classList.add('gallery__item');
  a.classList.add('gallery__link');
  a.setAttribute('href', picture.original);
  img.classList.add('gallery__image');
  img.setAttribute('src', picture.preview);
  img.dataset.source = picture.original;
  img.setAttribute('alt', picture.description);
  // Дата-індекс для гортання
  img.dataset.index = gallery.indexOf(picture);
  li.dataset.index = gallery.indexOf(picture);
  a.appendChild(img);
  li.appendChild(a);
  return li;
});

galleryRef.append(...galleryHtml);

// Делегуємо слухача
galleryRef.addEventListener('click', openModal);

// Відкривання модалки (фільтруємо клік, додаємо класи is-open,
// підставляємо атрибути, і додаємо слухача на Esc)
function openModal(event) {
  if (event.target.nodeName !== 'IMG') {
    console.log('мимо');
    return;
  }
  event.preventDefault();
  modalRef.classList.add('is-open');
  modalContentDivRef.classList.add('is-open');
  modalImageRef.setAttribute('src', event.target.dataset.source);
  modalImageRef.setAttribute('alt', event.target.getAttribute('alt'));
  // Отримуємо дата-індекс для гортання
  modalImageRef.dataset.index = event.target.dataset.index;
  currentIndex = Number(modalImageRef.dataset.index);
  console.log(currentIndex);
  window.addEventListener('keydown', onEscPress);
  window.addEventListener('keydown', onArrowPress);
}

function closeModal() {
  modalRef.classList.remove('is-open');
  modalContentDivRef.classList.remove('is-open');
  window.removeEventListener('keydown', onEscPress);
  window.removeEventListener('keydown', onArrowPress);
  modalImageRef.removeAttribute('src');
  modalImageRef.removeAttribute('alt');
}
// Закривання модалки Esc
function onEscPress(event) {
  if (event.code === 'Escape') {
    closeModal();
  }
}

// Закривання модалки
closeBtn.addEventListener('click', closeModal);

// Закриття кліком по фону
overlayRef.addEventListener('click', event => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
});

// Гортання клавішами ArrowRight / ArrowLeft

function onArrowPress(event) {
  if (event.code === 'ArrowRight') {
    if (currentIndex === maxIndex) {
      return;
    }
    currentIndex += 1;
    modalImageRef.dataset.index = currentIndex;

    console.log(currentIndex);
    modalImageRef.setAttribute(
      'src',
      galleryHtml[currentIndex + 1].firstChild.firstChild.dataset.source,
    );
    modalImageRef.setAttribute(
      'alt',
      galleryHtml[currentIndex + 1].firstChild.firstChild.alt,
    );
  }
  if (event.code === 'ArrowLeft') {
    if (currentIndex === 0) {
      currentIndex = 0;
      return;
    }
    currentIndex -= 1;
    modalImageRef.dataset.index = currentIndex;
    console.log(currentIndex);
    modalImageRef.setAttribute(
      'src',
      galleryHtml[currentIndex - 1].firstChild.firstChild.dataset.source,
    );

    modalImageRef.setAttribute(
      'alt',
      galleryHtml[currentIndex + 1].firstChild.firstChild.getAttribute('alt'),
    );
  }
}
