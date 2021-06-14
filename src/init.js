// @ts-nocheck
import _ from 'lodash';
import i18n from 'i18next';
import validate from './validate.js';
import loadData from './loadData.js';
import updateRssFeeds from './updateRssFeeds.js';
import locales from './locales/index.js';
import attachViewHandlers from './viewHandlers.js';

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

  const newInstance = i18n.createInstance();
  const i18Promise = newInstance.init({
    lng: 'ru',
    fallbackLng: 'ru',
    resources: locales,
  });

  const state = {
    feeds: [],
    posts: [],
    form: {
      error: null,
    },
    loading: {
      status: 'waiting',
      error: null,
    },
    UI: {
      modalPostId: null,
      seenPostsIds: new Set(),
    },
  };

  i18Promise.then((translate) => {
    const watchedState = attachViewHandlers(state, elements, translate);

    const { form, postsContainer } = elements;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.loading.status = 'waiting';
      watchedState.loading.error = null;
      watchedState.form.error = null;
      const { url } = Object.fromEntries(new FormData(e.target));
      const urls = state.feeds.map((feed) => feed.url);
      const validationError = validate(url, urls, translate);
      if (!_.isEmpty(validationError)) {
        watchedState.form.error = validationError;
        return;
      }
      watchedState.loading.status = 'loading';
      loadData(watchedState, url);
    });
    postsContainer.addEventListener('click', (el) => {
      if (el.target.dataset.id) {
        watchedState.UI.modalPostId = el.target.dataset.id;
        watchedState.UI.seenPostsIds.add(state.UI.modalPostId);
      }
    });
    updateRssFeeds(watchedState);
  });
  return i18Promise;
};
