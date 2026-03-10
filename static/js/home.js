





window.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.switch');

  buttons.forEach(button => {  
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-id');
      const progress = button.getAttribute('data-progress');
      fetch(`/update/${id}`, {  // send a request with desired progress to switch to
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ progress: progress })    // sending progress
      }).then(response => {
        if (response.ok) {
          window.location.reload();   
        } else {
          alert('Error with updating to-do list');
        }
      })
    });
  });
});
