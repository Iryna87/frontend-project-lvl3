import i18n from 'i18next';

i18n.init({
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        key1: 'Ошибка сети',
        key2: 'RSS уже существует',
        key3: 'RSS успешно загружен',
        key4: 'Ссылка должна быть валидным URL',
        key5: 'Просмотр',
      },
    },
  },
});

const feedsContainer = document.querySelector('.ulFeed');
const postsContainer = document.getElementById('posts');
const input = document.getElementById('input');
const feedback = document.querySelector('.feedback');

const view = (path, value) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'feed');
  if (path === 'serchForm.feeds') {
    const h3 = document.createElement('h3');
    h3.textContent = `${value.description}`;
    li.textContent = `${value.title}`;
    feedsContainer.prepend(li, h3);
  } if (path === 'serchForm.posts') {
    Array.from(value).forEach((item) => {
      const li1 = document.createElement('li');
      li1.setAttribute('class', 'post');
      const a = document.createElement('a');
      const button = document.createElement('button');
      button.textContent = i18n.t('key5');
      a.textContent = `${item.title}`;
      a.setAttribute('href', item.url);
      li1.append(a, button);
      postsContainer.prepend(li1);
    });
  } if (path === 'serchForm.valid') {
    input.value = '';
    input.classList.remove('is-invalid');
    feedback.classList.remove('is-invalid');
    feedback.textContent = i18n.t(`${value}`);
  } if (path === 'serchForm.errors') {
    feedback.classList.add('is-invalid');
    input.classList.add('is-invalid');
    feedback.textContent = i18n.t(`${value}`);
  }
};

export default view;
