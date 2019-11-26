// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));
// Use localStorage to store our login token
client.configure(feathers.authentication());

// Login screen
const loginHTML = `<main class="login container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100">Log in or signup</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
      <form class="form">
        <fieldset>
          <input class="block" type="email" name="email" placeholder="email">
        </fieldset>

        <fieldset>
          <input class="block" type="password" name="password" placeholder="password">
        </fieldset>

        <button type="button" id="login" class="button button-primary block signup">
          Log in
        </button>

        <button type="button" id="signup" class="button button-primary block signup">
          Sign up and log in
        </button>
      </form>
    </div>
  </div>
</main>`;


// Dashboard base HTML
const dashboardHTML = `<main class="flex flex-column">
  <header class="title-bar flex flex-row flex-center">
    <div class="title-wrapper block center-element">
      <h1>Dashboard</h1>
    </div>
  </header>

  <div class="flex flex-row flex-1 clear">
    <aside class="sidebar col col-3 flex flex-column flex-space-between">
      <header class="flex flex-row flex-center">
        <h4 class="font-300 text-center">
          Your are logged in with <span class="user-email"></span>!
        </h4>
      </header>

      <footer class="flex flex-row flex-center">
        <a href="#" id="logout" class="button button-primary">
          Sign Out
        </a>
      </footer>
    </aside>

    <div class="flex flex-column col col-9">
      <main class="comments flex flex-column flex-1 clear"></main>

      <form id="send-comment" class="form-inline justify-content-center d-inline-flex">
        <div class="form-group">
          <input type="text" name="text">
          <button class="button-primary" type="submit">Send Comment</button>
        </div>
      </form>
    </div>

  </div>
</main>`;

// Add users info to dashboard to the list
const addUserInfo = user => {
  const userEmail = document.querySelector('.user-email');

  if(userEmail && user.email) {
    // Add the user to the list
    userEmail.innerHTML += user.email;
  }
};

// Renders a comment to the page
const addComment = comment => {
  // The user that sent this comment (added by the populate-user hook)
  const { user = {} } = comment;
  const comments = document.querySelector('.comments');
  // Escape HTML to prevent XSS attacks
  const text = comment.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if(comments) {
    comments.innerHTML += `<div class="message flex flex-row">
      <div class="message-wrapper">
        <p class="message-header">
          <span class="username font-600">${user.email}</span>
          <span class="sent-date font-300">${moment(comment.createdAt).format('MMM Do, hh:mm:ss')}</span>
        </p>
        <p class="message-content font-300">${text}</p>
      </div>
    </div>`;

    // Always scroll to the bottom of our comments list
    comments.scrollTop = comments.scrollHeight - comments.clientHeight;
  }
};

// Show the login page
const showLogin = (error) => {
  if(document.querySelectorAll('.login').length && error) {
    document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p>There was an error: ${error.message}</p>`);
  } else {
    document.getElementById('app').innerHTML = loginHTML;
  }
};

// Shows the dashboard page
const showDashboard = async () => {
  document.getElementById('app').innerHTML = dashboardHTML;

  // Find the latest 5 comments. They will come with the newest first
  const comments = await client.service('comments').find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 5
    }
  });

  // We want to show the newest message last
  comments.data.reverse().forEach(addComment);
};

// Retrieve email/password object from the login/signup page
const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value
  };

  return user;
};

// Log in either using the given email/password or the token from storage
const login = async credentials => {
  try {
    if(!credentials) {
      // Try to authenticate using an existing token
      const result = await client.reAuthenticate();

      // Show Dashboard
      showDashboard();
      // Add user info to dashboard
      addUserInfo(result.user);
    } else {
      // Otherwise log in with the `local` strategy using the credentials we got
      const result = await client.authenticate({
        strategy: 'local',
        ...credentials
      });
      // Show Dashboard
      showDashboard();
      // Add user info to dashboard
      addUserInfo(result.user);
    }
  } catch(error) {
    // If we got an error, show the login page
    showLogin(error);
  }
};

const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async ev => {
    if (ev.target.closest(selector)) {
      handler(ev);
    }
  });
};

// "Signup and login" button click handler
addEventListener('#signup', 'click', async () => {
  // For signup, create a new user and then log them in
  const credentials = getCredentials();

  // First create the user
  await client.service('users').create(credentials);
  // If successful log them in
  await login(credentials);
});

// "Login" button click handler
addEventListener('#login', 'click', async () => {
  const user = getCredentials();

  await login(user);
});


// "Send" comment form submission handler
addEventListener('#send-comment', 'submit', async ev => {
  // This is the message text input field
  const input = document.querySelector('[name="text"]');

  ev.preventDefault();

  // Create a new message and then clear the input field
  await client.service('comments').create({
    text: input.value
  });

  input.value = '';
});

// "Logout" button click handler
addEventListener('#logout', 'click', async () => {
  await client.logout();

  document.getElementById('app').innerHTML = loginHTML;
});

// Listen to created events and add the new comment in real-time
client.service('comments').on('created', addComment);


// Call login right away so we can show the dashboard screen
// if the user can already be authenticated
login();
