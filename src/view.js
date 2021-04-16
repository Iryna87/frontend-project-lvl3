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
  const data = initState.find((post) => parseInt(post.idPost, 10) === id);
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
      h2feeds.textContent = i18n.t('key6');
      p.setAttribute('class', 'feed');
      p.textContent = `${value.title.trim()}`;
      h3.textContent = `${value.description.trim()}`;
      ul.prepend(p, h3);
      feedsContainer.append(ul);
      break;
    case 'posts':
      Array.from(value).forEach((item) => {
        if (postsContainer.textContent === '') {
          h2posts.textContent = i18n.t('key7');
        }
        const ul1 = document.createElement('ul');
        const li = document.createElement('li');
        li.setAttribute('class', 'post');
        const a = document.createElement('a');
        const btn = document.createElement('button');
        btn.textContent = i18n.t('key5');
        btn.setAttribute('class', 'btn');
        btn.setAttribute('idPost', item.idPost);
        btn.setAttribute('data-toggle', 'modal');
        btn.setAttribute('data-target', '#modal');
        btn.setAttribute('type', 'submit');
        a.textContent = `${item.title.trim()}`;
        a.setAttribute('class', 'font-weight-bold');
        a.setAttribute('href', item.url.trim());
        a.setAttribute('target', '_blanck');
        a.setAttribute('idPost', item.idPost);
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
      feedback.textContent = i18n.t(`${value}`);
      break;
    case 'formProcess.errors':
      input.classList.add('is-invalid');
      feedback.classList.remove('is-valid');
      feedback.classList.add('is-invalid');
      feedback.textContent = i18n.t(`${value}`);
      break;
    case 'loadingProcess.status':
      if (value === 'filling') {
        input.setAttribute('readonly', true);
        button.setAttribute('disabled', true);
      } if (value === 'finished') {
        input.removeAttribute('readonly');
        button.removeAttribute('disabled');
      }
      break;
    case 'UI.modalPostId':
      if (value !== null) {
        modal.classList.remove('hidden');
        fade.classList.add('on');
        document.body.classList.add('on');
        tModal.textContent = modalData(value, state).title;
        dModal.textContent = modalData(value, state).description;
        dModal.setAttribute('href', modalData(value, state).url);
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
