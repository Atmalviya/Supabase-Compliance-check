function getStatusColor(percentage) {
  if (percentage >= 80) return 'success';
  if (percentage >= 50) return 'warning';
  return 'danger';
}

export default getStatusColor; 