import i18n from 'i18next';
import {
  handleFeeds, handlePosts, handleFormProcessStatus,
  makeInvalid, removeInvalid, modalData, normalizeFontOfReadPosts,
} from './viewHandlers.js';

i18n.init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru: {
      translation: {
        validation_double_error: 'RSS уже существует',
        validation_unknown_error: 'Неизвстная ошибка валидации',
        validation_required_error: 'Поле не должно быть пустым',
        validation_url_error: 'Ссылка должна быть валидным URL',
        network_error: 'Ошибка сети',
        loading_success: 'RSS успешно загружен',
        loading_content_error: 'Ресурс не содержит валидный RSS',
        button_watch_name: 'Просмотр',
        feeds_container_name: 'Фиды',
        posts_container_name: 'Посты',
      },
    },
  },
});

export default (state, path, value, elements) => {
  const {
    feedsContainer, postsContainer, input, button,
    feedback, titleModal, descriptionModal, footerModal,
  } = elements;
  const h2feeds = document.createElement('h2');
  const h2posts = document.createElement('h2');
  const btn = document.createElement('button');

  switch (path) {
    case 'feeds':
      input.value = '';
      feedsContainer.textContent = '';
      feedsContainer.prepend(h2feeds);
      h2feeds.textContent = i18n.t('feeds_container_name');
      handleFeeds(value, feedsContainer);
      break;
    case 'posts':
      postsContainer.textContent = '';
      postsContainer.prepend(h2posts);
      h2posts.textContent = i18n.t('posts_container_name');
      btn.textContent = i18n.t('button_watch_name');
      handlePosts(value, postsContainer, btn);
      break;
    case 'formProcess.status':
      handleFormProcessStatus(value, input, button);
      break;
    case 'formProcess.error':
      makeInvalid(input, feedback);
      if (value !== null) {
        feedback.textContent = i18n.t(`${value}`);
      }
      break;
    case 'loadingProcess.status':
      removeInvalid(input, feedback);
      if (value !== 'waiting') {
        feedback.textContent = i18n.t(`${value}`);
      } if (value === 'waiting') {
        feedback.textContent = '';
      }
      break;
    case 'loadingProcess.error':
      if (value !== null) {
        makeInvalid(input, feedback);
        feedback.textContent = i18n.t(`${value}`);
      }
      break;
    case 'UI.modalPostId':
      if (value !== null) {
        const { title, description, url } = modalData(value, state.posts);
        titleModal.textContent = title;
        descriptionModal.textContent = description;
        footerModal.setAttribute('href', url);
      }
      break;
    case 'UI.seenPostsId':
      normalizeFontOfReadPosts(value);
      break;
    default:
      break;
  }
};
