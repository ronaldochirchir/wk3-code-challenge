document.addEventListener('DOMContentLoaded', () => {
    const filmsList = document.getElementById('films');
    const movieDetails = {
      title: document.getElementById('title'),
      poster: document.getElementById('poster'),
      runtime: document.getElementById('runtime'),
      showtime: document.getElementById('showtime'),
      availableTickets: document.getElementById('available-tickets'),
      buyButton: document.getElementById('buy-ticket'),
    };
  
    // Fetch movies
    fetch('http://localhost:3000/films')
      .then((response) => response.json())
      .then((movies) => {
        movies.forEach((movie) => {
          // Populate the movie list
          const li = document.createElement('li');
          li.textContent = movie.title;
          li.addEventListener('click', () => {
            displayMovieDetails(movie);
          });
          filmsList.appendChild(li);
        });
  
        // Display first movie by default
        if (movies.length > 0) {
          displayMovieDetails(movies[0]);
        }
      })
      .catch((error) => console.error('Error fetching movies:', error));
  
    // Display movie details
    function displayMovieDetails(movie) {
      movieDetails.title.textContent = movie.title;
      movieDetails.poster.src = movie.poster;
      movieDetails.runtime.textContent = `Runtime: ${movie.runtime}`;
      movieDetails.showtime.textContent = `Showtime: ${movie.showtime}`;
      const availableTickets = movie.capacity - movie.tickets_sold;
      movieDetails.availableTickets.textContent = `Tickets Available: ${availableTickets}`;
  
      // Handle ticket purchase
      movieDetails.buyButton.onclick = () => {
        if (availableTickets > 0) {
          movie.tickets_sold++;
          const remainingTickets = movie.capacity - movie.tickets_sold;
          movieDetails.availableTickets.textContent = `Tickets Available: ${remainingTickets}`;
          if (remainingTickets === 0) {
            alert('Sold Out!');
          }
  
          // Update the server with the new ticket count
          fetch(`http://localhost:3000/films/${movie.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: movie.tickets_sold }),
          })
          .catch((error) => console.error('Error updating ticket count:', error));
        } else {
          alert('No tickets left!');
        }
      };
    }
});
