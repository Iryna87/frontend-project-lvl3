import i18n from 'i18next';
import _ from 'lodash';

i18n.init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru: {
      translation: {
        key1: 'Ошибка сети',
        key2: 'RSS уже существует',
        key3: 'RSS успешно загружен',
        key4: 'Ссылка должна быть валидным URL',
        key5: 'Просмотр',
        key6: 'Фиды',
        key7: 'Посты',
        key8: 'Ресурс не содержит валидный RSS',
      },
    },
  },
});

const modalData = (id, initState) => {
  const data = _.flatten(initState).find((post) => parseInt(post.idPost, 10) === id);
  return {
    title: data.title,
    description: data.description,
    url: data.url,
  };
};

const changeFontClass = (ids) => {
  const posts = document.querySelectorAll('a');
  Array.from(posts).forEach((post) => {
    _.uniq(ids).forEach((id) => {
      if (parseInt(post.getAttribute('idpost'), 10) === id) {
        post.classList.remove('font-weight-bold');
        post.setAttribute('class', 'normal');
      }
    });
  });
};

const setAttribute = (el, attributes) => {
  attributes.forEach((atrr) => {
    el.setAttribute(atrr[0], atrr[1]);
  });
};

const render = (state, path, value, elements) => {
  const ul = document.createElement('ul');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  const h2feeds = document.createElement('h2');
  const h2posts = document.createElement('h2');
  const {
    feedsContainer, postsContainer, input, button, feedback, tModal, dModal, modal, fade,
  } = elements;

  switch (path) {
    case 'feeds':
      input.value = '';
      if (feedsContainer.textContent === '') {
        feedsContainer.prepend(h2feeds);
      }
      Array.from(value).forEach((item) => {
        p.setAttribute('class', 'feed');
        p.textContent = `${item.title.trim()}`;
        h3.textContent = `${item.description.trim()}`;
        ul.prepend(p, h3);
      });
      h2feeds.textContent = i18n.t('key6');
      feedsContainer.append(ul);
      break;
    case 'posts':
      postsContainer.textContent = '';
      h2posts.textContent = i18n.t('key7');
      Array.from(_.flatten(value)).forEach((item) => {
        const btnAttrs = [['class', 'btn'], ['idPost', item.idPost], ['data-toggle', 'modal'], ['data-target', '#modal'], ['type', 'submit']];
        const postAttrs = [['class', 'font-weight-bold'], ['href', item.url.trim()], ['target', '_blanck'], ['idPost', item.idPost]];
        const ul1 = document.createElement('ul');
        const li = document.createElement('li');
        li.setAttribute('class', 'post');
        const a = document.createElement('a');
        const btn = document.createElement('button');
        btn.textContent = i18n.t('key5');
        setAttribute(btn, btnAttrs);
        a.textContent = `${item.title.trim()}`;
        setAttribute(a, postAttrs);
        li.prepend(a, btn);
        ul1.prepend(li);
        postsContainer.prepend(h2posts);
        postsContainer.append(ul1);
      });
      break;
    case 'formProcess.status':
      input.value = '';
      input.classList.remove('is-invalid');
      feedback.classList.remove('is-invalid');
      feedback.classList.add('is-valid');
      if (value !== 'waiting') {
        feedback.textContent = i18n.t(`${value}`);
      } if (value === 'waiting') {
        feedback.textContent = '';
      }
      break;
    case 'formProcess.error':
      input.classList.add('is-invalid');
      feedback.classList.remove('is-valid');
      feedback.classList.add('is-invalid');
      if (value !== null) {
        feedback.textContent = i18n.t(`${value}`);
      }
      break;
    case 'loadingProcess.status':
      if (value === 'loading') {
        input.setAttribute('readonly', true);
        button.setAttribute('disabled', true);
      } if (value === 'finished') {
        input.removeAttribute('readonly');
        button.removeAttribute('disabled');
      }
      break;
    case 'loadingProcess.error':
      input.classList.add('is-invalid');
      feedback.classList.remove('is-valid');
      feedback.classList.add('is-invalid');
      if (value !== null) {
        feedback.textContent = i18n.t(`${value}`);
      }
      break;
    case 'UI.modalPostId':
      if (value !== null) {
        modal.classList.remove('hidden');
        fade.classList.add('on');
        document.body.classList.add('on');
        tModal.textContent = modalData(value, state.posts).title;
        dModal.textContent = modalData(value, state.posts).description;
        dModal.setAttribute('href', modalData(value, state.posts).url);
      }
      break;
    case 'UI.seenPostsId':
      changeFontClass(value);
      break;
    case 'UI.modalHidden':
      if (value === true) {
        modal.classList.add('hidden');
        fade.classList.remove('on');
        document.body.classList.remove('on');
      }
      break;
    default:
      break;
  }
};

export default render;
