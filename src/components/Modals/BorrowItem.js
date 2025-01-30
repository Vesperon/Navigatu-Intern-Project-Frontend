import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useState, useEffect } from "react";

const BorrowItem = (props) => {
  const data = props.item || {}; // Ensure data is an object, avoiding null/undefined errors

  const [item, setItem] = useState(data.item || "");
  const [quantity, setQuantity] = useState("");
  const [item_id, setItem_id] = useState(data.item_id || "");
  const [office, setOffice] = useState("");
  const [person, setPerson] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update state when props.item changes (if modal is reopened)
  useEffect(() => {
    setItem(data.item || "");
    setItem_id(data.item_id || "");
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/csrf-token", {
          withCredentials: true,
        });
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
      item_id,
      item,
      quantity,
      office,
      person,
      purpose,
    };

    axios
      .post("http://localhost:8000/track/borrow", formData, {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Item added:", response.data);
        props.onHide();
      })
      .catch((error) => {
        console.error("Error adding item:", error);
        setError("Failed to add item");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Borrow item</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel controlId="floatingItem" label="Item" className="mb-3">
              <Form.Control type="text" placeholder="Item" value={item} disabled />
            </FloatingLabel>
            <FloatingLabel controlId="floatingQuantity" label="Quantity" className="mb-3">
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingOffice" label="Office" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Office"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPerson" label="Person" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Person"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPurpose" label="Purpose" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </FloatingLabel>
            <Form.Control type="hidden" value={item_id} />
            {error && <p className="text-danger">{error}</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Confirm"}
            </Button>
            <Button onClick={props.onHide}>Cancel</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default BorrowItem;
