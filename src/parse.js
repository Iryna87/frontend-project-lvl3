let j = 1;

const parseFeed = (doc, i) => {
  const obj = {
    feedParsed: {
      title: '',
      description: '',
      idFeed: i,
    },
    postsParsed: [],
  };

  const posts = doc.getElementsByTagName('item');
  const titles = doc.getElementsByTagName('title');
  const descriptions = doc.getElementsByTagName('description');
  const feedTitle = Array.from(titles)[0];
  const feedDescription = Array.from(descriptions)[0];
  obj.feedParsed.title = feedTitle.textContent;
  obj.feedParsed.description = feedDescription.textContent;
  Array.from(posts).forEach((item) => {
    const descrip = item.getElementsByTagName('description');
    const arr = item.textContent.split('\n');
    const post = {
      title: arr[1].trim(),
      url: arr[3].trim(),
      description: descrip[0].textContent,
      idFeed: 1,
      idPost: j,
    };
    obj.postsParsed.push(post);
    j += 1;
  });
  return obj;
};

export default parseFeed;
