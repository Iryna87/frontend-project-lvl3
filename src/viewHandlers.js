/* eslint no-param-reassign: ["error", { "props": false }] */
import onChange from 'on-change';

const setAttribute = (el, attributes) => {
  attributes.forEach(([atrrName, attrValue]) => {
    el.setAttribute(atrrName, attrValue);
  });
};

const makeInvalid = (input, feedback) => {
  input.classList.add('is-invalid');
  feedback.classList.remove('is-valid');
  feedback.classList.add('is-invalid');
};

const makeValid = (input, feedback) => {
  input.classList.remove('is-invalid');
  feedback.classList.remove('is-invalid');
  feedback.classList.add('is-valid');
};

const modalData = (id, initState) => initState.find((post) => post.idPost === id);

const handleFeeds = (feeds, elements, translate) => {
  const ul = document.createElement('ul');
  const h2feeds = document.createElement('h2');
  const { feedsContainer } = elements;
  feedsContainer.textContent = '';
  feedsContainer.prepend(h2feeds);
  h2feeds.textContent = translate('feeds_container_name');
  feeds.forEach((item) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    p.textContent = item.title.trim();
    h3.textContent = item.description.trim();
    p.setAttribute('class', 'feed');
    li.setAttribute('class', 'list-group-item');
    li.prepend(p, h3);
    ul.setAttribute('class', 'list-group mb-5');
    ul.append(li);
    feedsContainer.append(ul);
  });
};

const handlePosts = (posts, elements, translate, state) => {
  const { postsContainer } = elements;
  const ul1 = document.createElement('ul');
  const h2posts = document.createElement('h2');
  postsContainer.textContent = '';
  postsContainer.prepend(h2posts);
  h2posts.textContent = translate('posts_container_name');
  posts.forEach((item) => {
    const isSeen = state.UI.seenPostsIds.has(item.idPost);
    const btnAttrs = [['class', 'btn btn-primary btn-sm'], ['data-id', item.idPost], ['data-bs-toggle', 'modal'], ['data-bs-target', '#modal'], ['type', 'submit']];
    const postAttrs = [['class', isSeen ? 'normal' : 'fw-bold'], ['href', item.url.trim()], ['target', '_blanck'], ['data-id', item.idPost], ['rel', 'noopener noreferrer']];
    const a = document.createElement('a');
    const btn = document.createElement('button');
    const li1 = document.createElement('li');
    btn.textContent = translate('button_watch_name');
    a.textContent = item.title.trim();
    setAttribute(btn, btnAttrs);
    setAttribute(a, postAttrs);
    li1.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
    li1.prepend(a, btn);
    ul1.setAttribute('class', 'list-group');
    ul1.append(li1);
    postsContainer.append(ul1);
  });
};

const handleFormError = (error, elements, translate) => {
  const { input, feedback } = elements;
  if (error === null) {
    makeValid(input, feedback);
    feedback.textContent = '';
  } else {
    makeInvalid(input, feedback);
    feedback.textContent = translate(error);
  }
};

const handleLoadingStatus = (status, elements, translate) => {
  const { input, button, feedback } = elements;
  switch (status) {
    case 'loading':
      input.value = '';
      input.setAttribute('readonly', true);
      button.setAttribute('disabled', true);
      break;
    case 'finished':
      input.removeAttribute('readonly');
      button.removeAttribute('disabled');
      break;
    case 'loading_success':
      feedback.textContent = translate(status);
      break;
    case 'waiting':
      feedback.textContent = '';
      break;
    default:
      break;
  }
};

const handleLoadingError = (error, elements, translate) => {
  const { input, feedback } = elements;
  if (error) {
    makeInvalid(input, feedback);
    feedback.textContent = translate(error);
  } else {
    makeValid(input, feedback);
    feedback.textContent = '';
  }
};

const handleModalPostId = (id, elements, translate, state) => {
  const { titleModal, descriptionModal, footerModal } = elements;
  if (id === null) {
    return;
  }
  const { title, description, url } = modalData(id, state.posts);
  titleModal.textContent = title;
  descriptionModal.textContent = description;
  footerModal.setAttribute('href', url);
};

const handleseenPostsIds = (readPostsIds) => {
  const posts = document.querySelectorAll('a');
  [...posts].forEach((post) => {
    if (readPostsIds.has(post.dataset.id)) {
      post.classList.remove('fw-bold');
      post.setAttribute('class', 'normal');
    }
  });
};

const mapping = {
  feeds: handleFeeds,
  posts: handlePosts,
  'form.error': handleFormError,
  'loading.status': handleLoadingStatus,
  'loading.error': handleLoadingError,
  'UI.modalPostId': handleModalPostId,
  'UI.seenPostsIds': handleseenPostsIds,
};

const attachViewHandlers = (state, elements, translate) => (
  onChange(state, (path, value) => mapping[path]?.(value, elements, translate, state))
);

export default attachViewHandlers;
