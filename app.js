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

  // Fetch films from the API
  fetch('http://localhost:3000/films')
    .then((response) => response.json())
    .then((movies) => {
      movies.forEach((movie) => {
        // Populate the film list with clickable items
        const li = document.createElement('li');
        li.textContent = movie.title;
        li.addEventListener('click', () => {
          displayMovieDetails(movie, movies);
        });
        filmsList.appendChild(li);
      });

      // Display the details of the first movie
      if (movies.length > 0) {
        displayMovieDetails(movies[0], movies);
      }
    })
    .catch((error) => console.error('Error fetching movies:', error));

  // Function to display movie details and handle ticket purchase
  function displayMovieDetails(movie, movies) {
    movieDetails.title.textContent = movie.title;
    movieDetails.poster.src = movie.poster;
    movieDetails.runtime.textContent = `Runtime: ${movie.runtime}`;
    movieDetails.showtime.textContent = `Showtime: ${movie.showtime}`;

    const availableTickets = movie.capacity - movie.tickets_sold;
    movieDetails.availableTickets.textContent = `Tickets Available: ${availableTickets}`;

    // Disable the "Buy Ticket" button if no tickets are available
    if (availableTickets <= 0) {
      movieDetails.buyButton.disabled = true;
      movieDetails.buyButton.textContent = 'Sold Out';
    } else {
      movieDetails.buyButton.disabled = false;
      movieDetails.buyButton.textContent = 'Buy Ticket';
    }

    // Handle the ticket purchase event
    movieDetails.buyButton.onclick = () => {
      if (availableTickets > 0) {
        // Increment tickets sold
        movie.tickets_sold++;

        // Update available tickets count in UI
        const remainingTickets = movie.capacity - movie.tickets_sold;
        movieDetails.availableTickets.textContent = `Tickets Available: ${remainingTickets}`;

        // Update button state if no tickets are available
        if (remainingTickets <= 0) {
          movieDetails.buyButton.disabled = true;
          movieDetails.buyButton.textContent = 'Sold Out';
          alert('Sold Out!');
        }

        // Send the updated ticket count to the server
        fetch(`http://localhost:3000/films/${movie.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tickets_sold: movie.tickets_sold }),
        })
        .then(() => {
          console.log(`Ticket sold for ${movie.title}. Updated tickets sold: ${movie.tickets_sold}`);
        })
        .catch((error) => {
          console.error('Error updating ticket count:', error);
        });
      } else {
        alert('No tickets available!');
      }
    };
  }
});
