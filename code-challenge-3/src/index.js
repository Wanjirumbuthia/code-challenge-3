// Your code here
const filmsEndpoint = "http://localhost:3000/films";

// Variable declarations to reference different HTML elements on the page
const movieListElement = document.getElementById("films");
const posterElement = document.getElementById("poster");
const titleElement = document.getElementById("title");
const durationElement = document.getElementById("runtime");
const descriptionElement = document.getElementById("film-info");
const showtimeElement = document.getElementById("showtime");
const availableTicketsElement = document.getElementById("ticket-num");
const buyButtonElement = document.getElementById("buy-ticket");

// Removes all child elements from the element and replaces them with new child elements.
movieListElement.replaceChildren();  

// Function to fetch movie details from the server
const fetchMovieDetails = (movieId) => {
  fetch(`${filmsEndpoint}/${movieId}`)
    .then(response => response.json())
    .then(movie => {
      displayMovieDetails(movie);
    })
    .catch(error => console.error('Error fetching movie details:', error));
}

// Function to display movie details on the webpage
const displayMovieDetails = (movie) => {
  titleElement.textContent = movie.title;
  durationElement.textContent = `${movie.runtime} minutes`;
  descriptionElement.textContent = movie.description;
  showtimeElement.textContent = movie.showtime;
  posterElement.src = movie.poster;

  let ticketsRemaining = movie.capacity - movie.tickets_sold;
  availableTicketsElement.textContent = ticketsRemaining;
  
  updateTicketStatus(ticketsRemaining);
}

// Function to update the ticket count and handle the "Sold Out" status
const updateTicketStatus = (ticketsRemaining) => {
  buyButtonElement.addEventListener("click", (event) => {
    event.preventDefault();

    if (ticketsRemaining > 0) {
      ticketsRemaining--;
      availableTicketsElement.textContent = ticketsRemaining;
      updateTicketsOnServer(ticketsRemaining);
      postNewTicket();
    } else {
      buyButtonElement.innerHTML = "Sold Out";
      buyButtonElement.disabled = true;
    }
  });
}

// Function to update tickets_sold on the server
const updateTicketsOnServer = (ticketsRemaining) => {
  const id = 1; // Assuming you are always updating the details for movie with id 1
  fetch(`${filmsEndpoint}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tickets_sold: movie.capacity - ticketsRemaining,
    }),
  })
    .then(response => response.json())
    .then(updatedMovie => console.log(updatedMovie))
    .catch(error => console.error('Error updating ticket status:', error));
}

// Function to post new ticket to the tickets endpoint
const postNewTicket = () => {
  const id = 1; // Assuming you are always posting the ticket for movie with id 1
  fetch(`http://localhost:3000/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      film_id: id,
      number_of_tickets: 1,
    }),
  })
    .then(response => response.json())
    .then(newTicket => console.log(newTicket))
    .catch(error => console.error('Error posting new ticket:', error));
}

// Function to delete a film from the server
const deleteMovieDetails = (movieId, listItem) => {
  fetch(`${filmsEndpoint}/${movieId}`, { method: "DELETE" })
    .then(response => response.json())
    .then(details => {
      console.log(details);
      listItem.remove(); // Remove the film from the list after successful deletion
    })
    .catch(error => console.error('Error deleting movie:', error));
}

// Function to create a list item for a movie
const createMovieListItem = (movie) => {
  const movieItem = document.createElement("li");
  movieItem.textContent = movie.title.toUpperCase();
  movieItem.style.color = "blue";

  // Create a delete button for each film
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.style.color = "gray";
  deleteButton.style.cursor = "pointer";

  deleteButton.addEventListener("click", () => {
    deleteMovieDetails(movie.id, movieItem);
  });

  movieItem.append(deleteButton);

  movieItem.addEventListener("click", () => {
    fetchMovieDetails(movie.id);
  });

  return movieItem;
}

// Function to display a list of movies and add click event listeners to each movie item
const displayMovieList = () => {
  fetch(filmsEndpoint)
    .then(response => response.json())
    .then(movieList => {
      movieList.forEach(movie => {
        const movieItem = createMovieListItem(movie);
        movieListElement.append(movieItem);
      });
    })
    .catch(error => console.error('Error fetching movie list:', error));
}

// Initialize the movie list on page load
displayMovieList();
