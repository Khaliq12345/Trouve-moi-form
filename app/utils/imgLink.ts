export default (imgId: string) => {
  const config = useRuntimeConfig();
  return `${config.public.directusUrl}assets/${imgId}?access_token=${config.public.staticTokenPublic}`;
};
