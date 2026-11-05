import { useState } from "react";
import "./App.css";

const API = "http://localhost:7000";

function App() {

    const [page, setPage] = useState("login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);

    // REGISTER FUNCTION

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(`${API}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await response.json();

            setMessage(data.message);

            if (response.ok) {

                setName("");
                setEmail("");
                setPassword("");

                setPage("login");

            }

        } catch (error) {

            setMessage("Backend connection failed:", error);

        }

    };


    // LOGIN FUNCTION

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(`${API}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await response.json();

            setMessage(data.message);

            if (response.ok) {

                // Store JWT token
                localStorage.setItem("token", data.token);

                setUser(data.user);

                setName("");
                setEmail("");
                setPassword("");

                setPage("dashboard");

            }

        } catch (error) {

            setMessage("Backend connection failed:", error);

        }

    };


    // GET PROTECTED PROFILE

    const getProfile = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(`${API}/profile`, {

                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`
                }

            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                setMessage(data.message);
            } else {
                handleLogout();
                setMessage(data.message);
            }

        } catch (error) {

            setMessage("Unable to fetch profile:", error);

        }

    };


    // LOGOUT FUNCTION

    const handleLogout = () => {

        localStorage.removeItem("token");

        setUser(null);

        setPage("login");

        setMessage("Logged out successfully");

    };


    return (

        <div className="container">

            {page === "register" && (

                <div className="card">

                    <h2>Register</h2>

                    <form onSubmit={handleRegister}>

                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit">
                            Register
                        </button>

                    </form>

                    <p>
                        Already have an account?
                        <span onClick={() => {
                            setPage("login");
                            setMessage("");
                        }}>
                            Login
                        </span>
                    </p>

                    <p>{message}</p>

                </div>

            )}


            {page === "login" && (

                <div className="card">

                    <h2>Login</h2>

                    <form onSubmit={handleLogin}>

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit">
                            Login
                        </button>

                    </form>

                    <p>
                        Don't have an account?
                        <span onClick={() => {
                            setPage("register");
                            setMessage("");
                        }}>
                            Register
                        </span>
                    </p>

                    <p>{message}</p>

                </div>

            )}


            {page === "dashboard" && (

                <div className="card">

                    <h2>Welcome!</h2>

                    <h3>{user?.name}</h3>

                    <p>{user?.email}</p>

                    <button onClick={getProfile}>
                        Verify JWT & Get Profile
                    </button>

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                    <p>{message}</p>

                </div>

            )}

        </div>

    );

}

export default App;