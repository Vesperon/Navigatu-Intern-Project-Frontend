import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/csrf-token", {
          withCredentials: true,
        });
        // Call the API after setting the token
        setCsrfToken(response.data.csrf_token);
        console.log(csrfToken);
      } catch (error) {
        console.error("Error fetching token:", error);
        setError("Error fetching data. Please try again later.");
      }
    }
    fetchToken();
      
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    

    try {
   

      const response = await axios.post(
        "http://localhost:8000/api/auth/login",{
          email,
          password,
        },{
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken, // Include the CSRF token in headers
          },
          withCredentials: true, // Add this
      },
        
          
      );

      // Store the token in local storage or session storage
      localStorage.setItem("token", response.data.token);

      // Redirect user to /track
      navigate("/track");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center "
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: "400px" }} className="login-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 email " controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button type="submit" className="sign_in ">
              Sign In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
