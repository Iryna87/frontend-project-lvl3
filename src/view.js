const feedsContainer = document.querySelector('.ulFeed');
const postsContainer = document.getElementById('posts');
const input = document.getElementById('input');
const feedback = document.querySelector('.feedback');

const view = (path, value) => {
  const li = document.createElement('li');
  li.setAttribute('class', 'feed');
  if (path === 'serchForm.feeds') {
    li.textContent = `${value.title}\n${value.description}`;
    feedsContainer.prepend(li);
  } if (path === 'serchForm.posts') {
    Array.from(value).forEach((item) => {
      const li1 = document.createElement('li');
      li1.setAttribute('class', 'post');
      const a = document.createElement('a');
      const button = document.createElement('button');
      button.textContent = 'Просмотр';
      a.textContent = `${item.title}`;
      a.setAttribute('href', item.url);
      li1.append(a, button);
      postsContainer.prepend(li1);
    });
  } if (path === 'serchForm.valid' && value === true) {
    input.value = '';
    input.classList.remove('is-invalid');
    feedback.classList.remove('is-invalid');
    feedback.textContent = 'RSS успешно загружен';
  } if (path === 'serchForm.errors') {
    feedback.classList.add('is-invalid');
    input.classList.add('is-invalid');
    feedback.textContent = value;
  }
};

export default view;
