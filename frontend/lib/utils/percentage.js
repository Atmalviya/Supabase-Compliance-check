function getPercentage(enabled, total) {
  if (!total) return 0;
  return Math.round((enabled / total) * 100);
}

export default getPercentage; 