fetch('http://localhost:5000/api/admin/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
})
.then(response => response.json())
.then(data => {
  console.log('Response:', data);
  setLoading(false);
})
.catch(error => {
  console.error('Error:', error);
  setLoading(false);
});