import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";

const EditItem = (props) => {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [item_id, setItem_id] = useState();
  const [quantity, setQuantity] = useState(0);
  const [tbi_assigned, setTbi_assigned] = useState("");
  const [person, setPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
      e.preventDefault();
      
      
    setLoading(true); // Start loading indicator

    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/csrf-token", {
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
        setItem_id(props.item);
        console.log(props.item);
        console.log(item_id);
    const formData = {
      item_id,
      item,
      category,
      quantity,
      tbi_assigned,
      person,
    };
    console.log(formData);
    axios
      .put("http://localhost:8000/inventory/update", formData, {
        headers: {
          "X-CSRF-Token": csrfToken, // Include the CSRF token in headers
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Item Updated:", response.data);
          props.onHide(); // Close modal after success
          window.location.reload();
      })
      .catch((error) => {
        console.error("Error Editing item:", error);
        setError("Failed to edit item");
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
          <Modal.Title id="contained-modal-title-vcenter">
            Edit item
          </Modal.Title>
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
            controlId="floatingSelect"
            label="Category"
            className="mb-3 ml-1 "
          >
            <Form.Select
              type="text"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                === Select Category ===
              </option>
              <option value="Consumable">Consumable</option>
              <option value="Non-Consumable">Non-Consumable</option>
            </Form.Select>
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
            controlId="floatingSelect"
            label="TBI"
            className="mb-3 ml-1 "
          >
            <Form.Select
              type="text"
              name="tbi_assigned"
              value={tbi_assigned}
              onChange={(e) => setTbi_assigned(e.target.value)}
            >
              <option value="" disabled>
                === Select TBI ===
              </option>
              <option value="Navigatu">Navigatu</option>
              <option value="TARA">TARA</option>
            </Form.Select>
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

export default EditItem;
