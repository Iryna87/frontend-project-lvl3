// @ts-nocheck
import _ from 'lodash';
import onChange from 'on-change';
import i18n from 'i18next';
import render from './view.js';
import validate from './validate.js';
import displayErrors from './displayErrors.js';
import loadData from './loadData.js';
import updateRssFeeds from './updateRssFeeds.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    input: document.querySelector('input[name=url]'),
    button: document.querySelector('.rss-form [type=submit]'),
    feedback: document.querySelector('.feedback'),
    titleModal: document.querySelector('.modal-title'),
    descriptionModal: document.querySelector('.modal-body'),
    footerModal: document.querySelector('.modal-footer .btn'),
  };

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

  const state = {
    feeds: [],
    posts: [],
    formProcess: {
      error: null,
    },
    loadingProcess: {
      status: 'waiting',
      error: null,
    },
    UI: {
      modalPostId: null,
      seenPostsId: [],
    },
  };

  const watchedState = onChange(state, (path, value) => i18n.changeLanguage('ru').then((translate) => {
    render(state, path, value, elements, translate);
  }));

  const { form, postsContainer } = elements;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.loadingProcess.status = 'waiting';
    watchedState.loadingProcess.error = null;
    watchedState.formProcess.error = null;
    const { url } = Object.fromEntries(new FormData(e.target));
    const urls = state.feeds.map((feed) => feed.url);
    const validationError = validate(url, urls);
    if (!_.isEmpty(validationError)) {
      displayErrors(validationError, watchedState);
      return;
    }
    watchedState.loadingProcess.status = 'loading';
    loadData(watchedState, url);
  });
  postsContainer.addEventListener('click', (el) => {
    if (el.target.dataset.id) {
      watchedState.UI.modalPostId = el.target.dataset.id;
      watchedState.UI.seenPostsId.push(state.UI.modalPostId);
    }
  });
  updateRssFeeds(watchedState, state);
};
