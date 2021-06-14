export default (url) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com';
  const newUrl = new URL('/get', proxy);
  newUrl.searchParams.set('url', url);
  newUrl.searchParams.set('disableCache', true);
  return newUrl.toString();
};
