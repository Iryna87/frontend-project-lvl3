import i18n from 'i18next';

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

const render = (path, value, elements) => {
  const ul = document.createElement('ul');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  const h2feeds = document.createElement('h2');
  const h2posts = document.createElement('h2');
  const { feedsContainer } = elements;
  const { postsContainer } = elements;
  const { input } = elements;
  const { button } = elements;
  const { feedback } = elements;
  const { title } = elements;
  const { modal } = elements;
  const { fade } = elements;
  const { description } = elements;

  switch (path) {
    case 'searchForm.feeds':
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
    case 'searchForm.posts':
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
        btn.setAttribute('idFeed', item.idFeed);
        btn.setAttribute('data-toggle', 'modal');
        btn.setAttribute('data-target', '#modal');
        btn.setAttribute('type', 'submit');
        btn.addEventListener('click', () => {
          a.classList.remove('bold');
          a.setAttribute('class', 'normal');
        });
        a.textContent = `${item.title.trim()}`;
        a.setAttribute('class', 'bold');
        a.setAttribute('href', item.url.trim());
        a.setAttribute('target', '_blanck');
        a.setAttribute('idPost', item.idPost);
        a.setAttribute('idFeed', item.idFeed);
        a.addEventListener('click', () => {
          a.classList.remove('bold');
          a.setAttribute('class', 'normal');
        });
        li.prepend(a, btn);
        ul1.prepend(li);
        postsContainer.prepend(h2posts);
        postsContainer.append(ul1);
      });
      break;
    case 'searchForm.valid':
      input.value = '';
      input.classList.remove('is-invalid');
      feedback.classList.remove('is-invalid');
      feedback.classList.add('is-valid');
      feedback.textContent = i18n.t(`${value}`);
      break;
    case 'searchForm.errors':
      feedback.classList.remove('is-valid');
      feedback.classList.add('is-invalid');
      input.classList.add('is-invalid');
      feedback.textContent = i18n.t(`${value}`);
      break;
    case 'UI.readOnly':
      if (value === true) {
        input.setAttribute('readonly', true);
        button.setAttribute('disabled', true);
      } if (value === false) {
        input.removeAttribute('readonly');
        button.removeAttribute('disabled');
      }
      break;
    case 'UI.modalPostTitle':
      title.textContent = value;
      modal.classList.remove('hidden');
      fade.classList.add('on');
      document.body.classList.add('on');
      break;
    case 'UI.modalPostDescription':
      description.textContent = value;
      break;
    case 'UI.modalPostUrl':
      description.setAttribute('href', value);
      break;
    case 'UI.modalModus':
      if (value === 'on') {
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
