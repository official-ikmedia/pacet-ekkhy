function handleFormSubmit(event) {
   event.preventDefault();

   Swal.fire({
      title: 'Kirim Doa dan Ucapan Ini?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, kirim!'
   }).then((result) => {
      if (result.isConfirmed) {
         const form = document.getElementById('combined-form');
         const spinner = document.getElementById('spinnerContainer');
         const submitButton = document.getElementById('submitButton');

         submitButton.disabled = true;
         submitButton.style.display = 'none';
         spinner.style.display = 'block';

         fetch(form.action, {
               method: 'POST',
               body: new FormData(form)
            })
            .then(response => {
               if (response.ok) {
                  Swal.fire('Terkirim!', 'Terima kasih atas doa dan ucapannya.', 'success');
                  form.reset();
                  fetchData();
               } else {
                  Swal.fire('Error!', 'Terjadi kesalahan, silakan coba lagi.', 'error');
               }
            })
            .catch(error => {
               Swal.fire('Error!', 'Terjadi kesalahan: ' + error.message, 'error');
            })
            .finally(() => {
               submitButton.disabled = false;
               submitButton.style.display = 'block';
               spinner.style.display = 'none';
            });
      }
   });
}

async function fetchData() {
   try {
      const response = await fetch(
         'https://script.google.com/macros/s/AKfycbzTigx5Jl6jWDA_kMkjlYpamv_vP56qYdVFQiDe9E5qhvSWJKOsChglrsH6jXPyl_gYgg/exec'
      );
      const data = await response.json();

      const commentsContainer = document.getElementById('comments-container');
      commentsContainer.innerHTML = '';
      data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // Sort by timestamp descending
      data.forEach(item => {
         const comment = document.createElement('div');
         comment.className = 'mb-4 bg-gradient p-3 rounded border border-light text-white';
         comment.innerHTML = `<div class="border-bottom fw-bold">${item.nama}</div> <div class="fst-italic mt-2">${item.doa}</div>`;
         commentsContainer.appendChild(comment);
      });
   } catch (error) {
      console.error('Error fetching data:', error);
   }
}

document.addEventListener('DOMContentLoaded', fetchData);