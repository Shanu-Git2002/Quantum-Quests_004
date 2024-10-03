const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

const firebaseUrl = 'https://quantum-quests-004-default-rtdb.firebaseio.com/users.json';

// Switch between login and signup forms
showSignup.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showLogin.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Signup function
document.getElementById('signup-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const phone = document.getElementById('signup-phone').value;

    const user = {
        name,
        email,
        password,  // Ideally hash the password before sending (using libraries like bcrypt)
        phone,
        signup_date: new Date().toISOString()
    };

    try {
        const response = await fetch(firebaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            alert('Signup successful!');
            signupForm.reset();
            signupForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        } else {
            alert('Signup failed!');
        }
    } catch (error) {
        console.error('Error during signup:', error);
    }
});

// Login function
document.getElementById('login-btn').addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(firebaseUrl);
        const data = await response.json();
        const users = Object.values(data);

        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            alert('Login successful!');
            window.location.href = 'index.html';  // Redirect to the main page
        } else {
            alert('Invalid credentials!');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
});
