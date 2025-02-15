import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { use, useState } from "react";
import axios from "axios";
const AddItem = (props) => {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [tbi_assigned, setTbi_assigned] = useState("");
  const [person, setPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("");
  const [set, setSet] = useState(1);
  const [property_num, setProperty_num] = useState("");
  const [serial_num, setSerial_num] = useState("");
  const [description, setDescription] = useState("");
  const [setItems, setSetItems] = useState([]);

  const addSetItem = () => {
    setSetItems([...setItems, { property_num: "", serial_num: "",description: "" }]);
  };

  // Handle change in dynamic inputs
  const handleSetItemChange = (index, field, value) => {
    const updatedSetItems = [...setItems];
    updatedSetItems[index][field] = value;
    setSetItems(updatedSetItems);
    console.log(updatedSetItems);
  };

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
    const formData = {
      item,
      category,
      quantity,
      tbi_assigned,
      unit,
      description,
      property_num,
      serial_num,
      set_items: unit === "SET" ? setItems : [],
    };
    console.log(formData);
    axios
      .post("http://localhost:8000/inventory/add", formData, {
        headers: {
          "X-CSRF-Token": csrfToken, // Include the CSRF token in headers
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        // window.location.reload();
      });
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Add item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel controlId="floatingInput" label="Item" className="mb-3">
            <Form.Control type="text" placeholder="Item" value={item} onChange={(e) => setItem(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="Description" className="mb-3">
            <Form.Control type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="Property #" className="mb-3">
            <Form.Control type="text" placeholder="Property #" value={property_num} onChange={(e) => setProperty_num(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="Serial #" className="mb-3">
            <Form.Control type="text" placeholder="Serial #" value={serial_num} onChange={(e) => setSerial_num(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingInput" label="Quantity" className="mb-3">
            <Form.Control type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Category" className="mb-3">
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="" disabled>=== Select Category ===</option>
              <option value="School Supplies">School Supplies</option>
              <option value="ICT Supplies">ICT Supplies</option>
              <option value="ICT Equipments">ICT Equipments</option>
              <option value="Furniture & Appliances">Furniture & Appliances</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="TBI" className="mb-3">
            <Form.Select value={tbi_assigned} onChange={(e) => setTbi_assigned(e.target.value)}>
              <option value="" disabled>=== Select TBI ===</option>
              <option value="Navigatu">Navigatu</option>
              <option value="TARA">TARA</option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel controlId="floatingSelect" label="Unit" className="mb-3">
            <Form.Select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="" disabled>=== Select Unit ===</option>
              <option value="PCS">PCS</option>
              <option value="SET">SET</option>
            </Form.Select>
          </FloatingLabel>

          {/* Show extra inputs if "SET" is selected */}
          {unit === "SET" && (
            <>
              <h5 className="my-2">Set Items</h5>
              {setItems.map((setItem, index) => (
                <div key={index} className="mb-3">
                  <h5 className="my-3">Item {index + 1}</h5>
                  <FloatingLabel controlId={`property_${index}`} label="Property #" className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Property #"
                      value={setItem.property_num}
                      onChange={(e) => handleSetItemChange(index, "property_num", e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId={`serial_${index}`} label="Serial #" className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Serial #"
                      value={setItem.serial_num}
                      onChange={(e) => handleSetItemChange(index, "serial_num", e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId={`serial_${index}`} label="Description" className="mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      value={setItem.description}
                      onChange={(e) => handleSetItemChange(index, "description", e.target.value)}
                    />
                  </FloatingLabel>
                </div>
              ))}
              <Button variant="outline-primary" onClick={addSetItem} className="mb-3">
                + Add Another Set Item
              </Button>
            </>
          )}

          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Confirm"}</Button>
          <Button onClick={props.onHide}>Cancel</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddItem;
