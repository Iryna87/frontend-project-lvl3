import _ from 'lodash';

const setAttribute = (el, attributes) => {
  attributes.forEach(([atrrName, attrValue]) => {
    el.setAttribute(atrrName, attrValue);
  });
};

const handleFeeds = (feeds, feedsContainer) => {
  const ul = document.createElement('ul');
  feeds.forEach((item) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    p.textContent = `${item.title.trim()}`;
    h3.textContent = `${item.description.trim()}`;
    p.setAttribute('class', 'feed');
    li.setAttribute('class', 'list-group-item');
    li.prepend(p, h3);
    ul.setAttribute('class', 'list-group mb-5');
    ul.append(li);
    feedsContainer.append(ul);
  });
};

const handlePosts = (posts, postsContainer, btn) => {
  const ul1 = document.createElement('ul');
  posts.forEach((item) => {
    const btnAttrs = [['class', 'btn btn-primary btn-sm'], ['data-id', item.idPost], ['data-toggle', 'modal'], ['data-target', '#modal'], ['type', 'submit']];
    const postAttrs = [['class', 'font-weight-bold'], ['href', item.url.trim()], ['target', '_blanck'], ['data-id', item.idPost], ['rel', 'noopener noreferrer']];
    const a = document.createElement('a');
    const li1 = document.createElement('li');
    a.textContent = `${item.title.trim()}`;
    setAttribute(btn, btnAttrs);
    setAttribute(a, postAttrs);
    li1.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
    li1.prepend(a, btn);
    ul1.setAttribute('class', 'list-group');
    ul1.append(li1);
    postsContainer.append(ul1);
  });
};

const handleFormProcessStatus = (status, input, button) => {
  if (status === 'loading') {
    input.setAttribute('readonly', true);
    button.setAttribute('disabled', true);
  } if (status === 'finished') {
    input.removeAttribute('readonly');
    button.removeAttribute('disabled');
  }
};

const makeInvalid = (input, feedback) => {
  input.classList.add('is-invalid');
  feedback.classList.remove('is-valid');
  feedback.classList.add('is-invalid');
  input.classList.add('is-invalid');
  feedback.classList.remove('is-valid');
  feedback.classList.add('is-invalid');
};

const removeInvalid = (input, feedback) => {
  input.classList.remove('is-invalid');
  feedback.classList.remove('is-invalid');
  feedback.classList.add('is-valid');
};

const modalData = (id, initState) => {
  const data = initState.find((post) => post.idPost === id);
  return data;
};

const normalizeFontOfReadPosts = (readPostsIds) => {
  const posts = document.querySelectorAll('a');
  [...posts].forEach((post) => {
    _.uniq(readPostsIds).forEach((id) => {
      if (post.dataset.id === id) {
        post.classList.remove('font-weight-bold');
        post.setAttribute('class', 'normal');
      }
    });
  });
};

export {
  handleFeeds, handlePosts, handleFormProcessStatus,
  makeInvalid, removeInvalid, modalData, normalizeFontOfReadPosts,
};
