const parseFeed = (rss) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(rss, 'text/xml');
  const errors = doc.querySelector('parsererror');
  const rssTag = doc.querySelector('rss');
  if (errors || !rssTag) {
    const error = new Error('Ресурс не содержит валидный RSS');
    error.code = 'parse_error';
    throw error;
  }
  const items = doc.getElementsByTagName('item');

  const titleTag = doc.querySelector('title');
  const title = titleTag.textContent.trim();

  const descriptionTag = doc.querySelector('description');
  const description = descriptionTag.textContent.trim();

  const posts = [...items].map((item) => {
    const postDescriptionTag = item.querySelector('description');
    const postDescription = postDescriptionTag.textContent.trim();

    const postTitleTag = item.querySelector('title');
    const postTitle = postTitleTag.textContent.trim();

    const postUrlTag = item.querySelector('link');
    const postUrl = postUrlTag.textContent.trim();

    return {
      title: postTitle,
      url: postUrl,
      description: postDescription,
    };
  });

  return {
    title,
    description,
    posts,
  };
};

export default parseFeed;
