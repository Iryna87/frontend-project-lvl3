import i18n from 'i18next';
import _ from 'lodash';

i18n.init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru: {
      translation: {
        network_error: 'Ошибка сети',
        loading_success: 'RSS успешно загружен',
        validation_double_error: 'RSS уже существует',
        validation_unknown_error: 'Неизвстная ошибка валидации',
        validation_required_error: 'Поле не должно быть пустым',
        validation_url_error: 'Ссылка должна быть валидным URL',
        validation_content_error: 'Ресурс не содержит валидный RSS',
        button_watch_name: 'Просмотр',
        feeds_container_name: 'Фиды',
        posts_container_name: 'Посты',
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

export default (state, path, value, elements) => {
  const ul = document.createElement('ul');
  const ul1 = document.createElement('ul');
  const h2feeds = document.createElement('h2');
  const h2posts = document.createElement('h2');
  const {
    feedsContainer, postsContainer, input, button, feedback, titleModal, descriptionModal,
  } = elements;

  switch (path) {
    case 'feeds':
      input.value = '';
      feedsContainer.textContent = '';
      feedsContainer.prepend(h2feeds);
      h2feeds.textContent = i18n.t('feeds_container_name');
      Array.from(value).forEach((item) => {
        const li = document.createElement('li');
        const h3 = document.createElement('h3');
        const p = document.createElement('p');
        p.textContent = `${item.title.trim()}`;
        h3.textContent = `${item.description.trim()}`;
        p.setAttribute('class', 'feed');
        li.setAttribute('class', 'list-group-item');
        li.prepend(p, h3);
        ul.setAttribute('class', 'list-group mb-5');
        ul.prepend(li);
      });
      feedsContainer.append(ul);
      break;
    case 'posts':
      postsContainer.textContent = '';
      postsContainer.prepend(h2posts);
      h2posts.textContent = i18n.t('posts_container_name');
      Array.from(_.flatten(value)).forEach((item) => {
        const btnAttrs = [['class', 'btn btn-primary btn-sm'], ['idPost', item.idPost], ['data-toggle', 'modal'], ['data-target', '#modal'], ['type', 'submit']];
        const postAttrs = [['class', 'font-weight-bold'], ['href', item.url.trim()], ['target', '_blanck'], ['idPost', item.idPost], ['rel', 'noopener noreferrer']];
        const a = document.createElement('a');
        const btn = document.createElement('button');
        const li1 = document.createElement('li');
        btn.textContent = i18n.t('button_watch_name');
        a.textContent = `${item.title.trim()}`;
        setAttribute(btn, btnAttrs);
        setAttribute(a, postAttrs);
        li1.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start');
        li1.prepend(a, btn);
        ul1.setAttribute('class', 'list-group');
        ul1.prepend(li1);
      });
      postsContainer.append(ul1);
      break;
    case 'formProcess.status':
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
        titleModal.textContent = modalData(value, state.posts).title;
        descriptionModal.textContent = modalData(value, state.posts).description;
        descriptionModal.setAttribute('href', modalData(value, state.posts).url);
      }
      break;
    case 'UI.seenPostsId':
      changeFontClass(value);
      break;
    default:
      break;
  }
};
