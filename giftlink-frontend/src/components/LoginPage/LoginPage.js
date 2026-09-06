import React, { useState, useEffect } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';


function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');

    const navigate = useNavigate();

    // Get existing authentication token
    const bearerToken = sessionStorage.getItem('auth-token');

    // Get login state from AuthContext
    const { setIsLoggedIn } = useAppContext();


    // If user is already logged in,
    // redirect to the main application
    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);


    // =========================
    // LOGIN
    // =========================

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const res = await fetch(
                `${urlConfig.backendUrl}/api/auth/login`,
                {
                    // HTTP method
                    method: 'POST',

                    // Request headers
                    headers: {
                        'content-type': 'application/json',

                        // Send Bearer token if available
                        'Authorization': bearerToken
                            ? `Bearer ${bearerToken}`
                            : ''
                    },

                    // User data
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            // Convert response to JSON
            const json = await res.json();

            console.log('Login response:', json);


            // =========================
            // SUCCESS
            // =========================

            if (json.authtoken) {

                // Save authentication token
                sessionStorage.setItem(
                    'auth-token',
                    json.authtoken
                );

                // Save user's name
                sessionStorage.setItem(
                    'name',
                    json.userName
                );

                // Save user's email
                sessionStorage.setItem(
                    'email',
                    json.userEmail
                );

                // Update global login state
                setIsLoggedIn(true);

                // Redirect to application
                navigate('/app');

            } else {

                // =========================
                // LOGIN ERROR
                // =========================

                setEmail('');
                setPassword('');

                setIncorrect(
                    json.error || 'Wrong password. Try again.'
                );

                // Clear error after 2 seconds
                setTimeout(() => {
                    setIncorrect('');
                }, 2000);
            }

        } catch (e) {

            console.log(
                'Error fetching details: ' + e.message
            );

            setIncorrect(
                'Unable to connect to server.'
            );

        }
    };


    // =========================
    // PAGE
    // =========================

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-6 col-lg-4">

                    <div className="login-card p-4 border rounded">

                        <h2 className="text-center mb-4 font-weight-bold">
                            Login
                        </h2>


                        {/* Email */}

                        <div className="mb-3">

                            <label
                                htmlFor="email"
                                className="form-label"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setIncorrect('');
                                }}
                            />

                        </div>


                        {/* Password */}

                        <div className="mb-4">

                            <label
                                htmlFor="password"
                                className="form-label"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setIncorrect('');
                                }}
                            />


                            {/* Error message */}

                            <span
                                style={{
                                    color: 'red',
                                    height: '.5cm',
                                    display: 'block',
                                    fontStyle: 'italic',
                                    fontSize: '12px'
                                }}
                            >
                                {incorrect}
                            </span>

                        </div>


                        {/* Login button */}

                        <button
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleLogin}
                        >
                            Login
                        </button>


                        {/* Register link */}

                        <p className="mt-4 text-center">
                            New here?{' '}

                            <a
                                href="/app/register"
                                className="text-primary"
                            >
                                Register Here
                            </a>
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default LoginPage;

