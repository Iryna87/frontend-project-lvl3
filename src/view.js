import {
  handleFeeds, handlePosts, handleLoadingProcessStatus,
  makeInvalid, removeInvalid, modalData, normalizeFontOfReadPosts,
} from './viewHandlers.js';

export default (state, path, value, elements, translate) => {
  const {
    feedsContainer, postsContainer, input, button,
    feedback, titleModal, descriptionModal, footerModal,
  } = elements;
  const h2feeds = document.createElement('h2');
  const h2posts = document.createElement('h2');

  switch (path) {
    case 'feeds':
      input.value = '';
      feedsContainer.textContent = '';
      feedsContainer.prepend(h2feeds);
      h2feeds.textContent = translate('feeds_container_name');
      handleFeeds(value, feedsContainer);
      break;
    case 'posts':
      postsContainer.textContent = '';
      postsContainer.prepend(h2posts);
      h2posts.textContent = translate('posts_container_name');
      handlePosts(value, postsContainer, translate);
      break;
    case 'formProcess.error':
      makeInvalid(input, feedback);
      if (value !== null) {
        feedback.textContent = translate(`${value}`);
      }
      break;
    case 'loadingProcess.status':
      removeInvalid(input, feedback);
      handleLoadingProcessStatus(value, input, button, feedback, translate);
      break;
    case 'loadingProcess.error':
      if (value !== null) {
        makeInvalid(input, feedback);
        feedback.textContent = translate(`${value}`);
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
