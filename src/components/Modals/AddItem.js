import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import {  useState } from "react";
import axios from "axios";
const AddItem = (props) => {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState();
  const [tbi_assigned, setTbi_assigned] = useState("");
  const [person, setPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    

   


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator
    
    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/csrf-token",{
            withCredentials: true,
        });
        // Call the API after setting the token
        submitForm(response.data.csrf_token);
      } catch (error) {
        console.error("Error fetching token:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchToken();
  };
  
  const submitForm = (csrfToken) => {
    const formData = {
      item,
      quantity,
      tbi_assigned,
      person,
    };
  
    axios.post("http://localhost:8000/inventory/add", formData, {
      headers: {
        'X-CSRF-Token': csrfToken, // Include the CSRF token in headers
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log("Item added:", response.data);
      props.onHide(); // Close modal after success
    })
    .catch((error) => {
      console.error("Error adding item:", error);
      setError("Failed to add item");
    })
    .finally(() => {
      setLoading(false); // Stop loading indicator
    });
  };
  

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel
            controlId="floatingInput"
            label="Item"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Item"
              name="item"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Quantity"
            className="mb-3"
          >
            <Form.Control
              type="number"
              placeholder="Quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="TBI Assigned"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="TBI Assigned"
              name="tbi_assigned"
              value={tbi_assigned}
              onChange={(e) => setTbi_assigned(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Person"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Person"
              name="person"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
            />
          </FloatingLabel>
          {error && <p className="text-danger">{error}</p>}{" "}
          {/* Display error */}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Confirm"}
          </Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddItem;
