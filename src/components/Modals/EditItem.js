import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import axios from "axios";

const EditItem = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [setItems, setSetItems] = useState([]);
  const [property, setProperty] = useState({
    item: "",
    property_num: "",
    serial_num: "",
    description: "",
    category: "",
    tbi_assigned: "",
    unit: "",
    quantity: 0,
    set_items: [], // Ensure this is initialized as an empty array
  });
  useEffect(() => {
    if (props.item) {
      console.log(props.item); // Log the incoming props
      setProperty({ ...props.item }); // Set the entire property object from props
      setSetItems(props.item.set_items); // Set the set_items from the prop
    }
  }, [props.item]);
  
  
  console.log(property);
  const addSetItem = () => {
    setProperty((prevState) => ({
      ...prevState,
      set_items: [
        ...prevState.set_items,
        { property_num: "", serial_num: "", description: "" },
      ],
    }));
  };

  const handleSetItemChange = (index, field, value) => {
    setProperty((prevState) => {
      const updatedSetItems = [...prevState.set_items];
      updatedSetItems[index][field] = value;
      return { ...prevState, set_items: updatedSetItems };
    });
  };

  const handleDeleteSetItem = (index) => {
    setSetItems((prevItems) => {
      // Create a new array by filtering out the item at the specified index
      const updatedItems = prevItems.filter((_, itemIndex) => itemIndex !== index);
      return updatedItems;
    });
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
      item_id: property.item_id,
      item: property.item,
      category: property.category,
      quantity: property.quantity,
      tbi_assigned: property.tbi_assigned,
      unit: property.unit,
      description: property.description,
      property_num: ["ICT Equipments", "Furniture & Appliances"].includes(property.category)
        ? property.property_num
        : null,
      serial_num: ["ICT Equipments", "Furniture & Appliances"].includes(property.category)
        ? property.serial_num
        : null,
      // Use the latest state of setItems, which will reflect the changes (e.g., deletions)
      set_items: property.unit === "SET" ? setItems : [],
    };
  
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
              name="item"
              value={property.item || ""}
              onChange={(e) => setProperty({...property, item: e.target.value})}
              required
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Property #"
            className="my-2"
          >
            <Form.Control
              type="text"
              value={property.property_num || ""}
              onChange={(e) => setProperty({...property, property_num: e.target.value})}
              required
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Serial #"
            className="mb-2"
          >
            <Form.Control
              type="text"
              value={property.serial_num || ""}
              onChange={(e) => setProperty({...property, serial_num: e.target.value})}
              required
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingInput"
            label="Description"
            className="mb-3"
          >
            <Form.Control
              type="text"
              value={property.description || ""}
              onChange={(e) => setProperty({...property, description: e.target.value})}
              required
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
              value={property.quantity || ""}
              onChange={(e) => setProperty({...property, quantity: e.target.value})}
              required
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
              value={property.category || ""}
              onChange={(e) => setProperty({...property, category: e.target.value})}
              
            >
              <option value="" disabled>
                === Select Category ===
              </option>
              <option value="School Supplies">School Supplies</option>
              <option value="ICT Supplies">ICT Supplies</option>
              <option value="ICT Equipments">ICT Equipments</option>
              <option value="Furniture & Appliances">
                Furniture & Appliances
              </option>
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingSelect"
            label="TBI"
            className="mb-3 ml-1 "
          >
            <Form.Select
              type="text"
              name="tbi_assigned"
              value={property.tbi_assigned || ""}
              onChange={(e) => setProperty({...property, tbi_assigned: e.target.value})}
            >
              <option value="" disabled>
                === Select TBI ===
              </option>
              <option value="Navigatu">Navigatu</option>
              <option value="TARA">TARA</option>
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingSelect"
            label="Unit"
            className="mb-3"
          >
            <Form.Select
              value={property.unit || ""}
              onChange={(e) => setProperty({...property, unit: e.target.value})}
              required
            >
              <option value="" disabled>
                === Select Unit ===
              </option>
              <option value="PCS">PCS</option>
              <option value="SET">SET</option>
            </Form.Select>
          </FloatingLabel>
          {property.unit === "SET" && ["ICT Equipments", "Furniture & Appliances"].includes(property.category) && property.set_items.length > 0 && (
                      <>
                        <h5 className="my-2">Set Items</h5>
                        {setItems.map((setItem, index) => (
                          <div key={index} className="mb-3">
                            <h5 className="my-3">Item {index + 1}</h5>
                            <FloatingLabel controlId={`property_${index}`} label="Property #" className="mb-2">
                              <Form.Control
                                type="text"
                                value={setItem.property_num}
                                onChange={(e) => handleSetItemChange(index, "property_num", e.target.value)}
                                required
                              />
                            </FloatingLabel>
                            <FloatingLabel controlId={`serial_${index}`} label="Serial #" className="mb-2">
                              <Form.Control
                                type="text"
                                value={setItem.serial_num}
                                onChange={(e) => handleSetItemChange(index, "serial_num", e.target.value)}
                                required
                              />
                            </FloatingLabel>
                            <FloatingLabel controlId={`description_${index}`} label="Description" className="mb-2">
                              <Form.Control
                                type="text"
                                value={setItem.description}
                                onChange={(e) => handleSetItemChange(index, "description", e.target.value)}
                                required
                              />
                            </FloatingLabel>
                            <Button
                              variant="outline-danger"
                              onClick={() => handleDeleteSetItem(index)}  q
                              className="mt-2"
                            >
                              Delete Set
                            </Button>
                          </div>
                          
                        ))}
                      </>
                    )}
          
                    {property.unit === "SET" && ["ICT Equipments", "Furniture & Appliances"].includes(property.category) && (
                      <Button variant="outline-primary" onClick={addSetItem} className="mb-3">
                        + Add Set Item
                      </Button>
                    )}
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
