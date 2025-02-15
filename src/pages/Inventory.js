import "../App.css";
import { FaSearch } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/esm/Button";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import AddItem from "../components/Modals/AddItem";
import BorrowItem from "../components/Modals/BorrowItem";
import ConsumeItem from "../components/Modals/ConsumeItem";
import EditItem from "../components/Modals/EditItem";
import { FaFilter } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";

const Inventory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [borrowModal, setBorrowModal] = useState(false);
  const [consumeModal, setConsumeModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [item, setItem] = useState(null);
  const [search, setSearch] = useState("");
  const [item_id, setItemID] = useState(null);
  const [filter, setFilter] = useState("All");
  const [visibleSetItems, setVisibleSetItems] = useState({});


  const toggleSetItemsVisibility = (itemId) => {
    setVisibleSetItems((prevState) => ({
      ...prevState,
      [itemId]: !prevState[itemId], // Toggle visibility for this item
    }));
  };
  const handleBorrow = (props) => {
    setItem(props);
    setBorrowModal(true);
  };
  const handleConsume = (props) => {
    setItem(props);

    setConsumeModal(true);
  };

  const handleDelete = (props) => {
    setLoading(true); // Start loading indicator
    setItemID(props);
    const fetchToken = async () => {
      try {
        const response = await axios.get("http://localhost:8000/csrf-token", {
          withCredentials: true,
        });
        // Call the API after setting the token
        deleteItem(response.data.csrf_token);
      } catch (error) {
        console.error("Error fetching token:", error);
        setError("Error fetching data. Please try again later.");
        setLoading(false);
      }
    };

    fetchToken();
  };

  const handleEdit = (props) => {
    setItem(props);
    setEditModal(true);
  };

  const deleteItem = (csrfToken) => {
    axios
      .delete(`http://localhost:8000/inventory/delete/${item_id}`, {
        headers: {
          "X-CSRF-Token": csrfToken, // Include the CSRF token in headers
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Item deleted:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
        setError("Failed to delete item");
      })
      .finally(() => {
        setLoading(false); // Stop loading indicator
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/inventory");
        setData(response.data); // Set the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false); // Ensure loading stops in both success and error cases
      }
    };
    fetchData();
  }); // Added csrfToken as a dependency to the useEffect

  return (
    <>
      <div className="container inventory">
        <div className="row container mt-5  mb-3 ">
          <div className="col inventory-search">
            <div className="search-wrapper">
              <FaSearch className="my-auto" />
              <input
                placeholder="Search items..."
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label for="filter">
                <FaFilter className="my-2 mx-2"></FaFilter>{" "}
              </label>
              <select
                name="filter"
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="School Supplies">School Supplies</option>
                <option value="ICT Supplies">ICT Supplies</option>
                <option value="ICT Equipments">ICT Equipments</option>
                <option value="Furniture & Appliances">
                  Furniture & Appliances
                </option>
              </select>
            </div>
          </div>

          <div className="col-auto mb-2 ">
            <button
              type="button"
              class="btn btn-dark  button-add"
              onClick={() => setAddModal(true)}
            >
              Add item
            </button>
          </div>
        </div>

        <AddItem show={addModal} onHide={() => setAddModal(false)} />
        <BorrowItem
          item={item}
          show={borrowModal}
          onHide={() => setBorrowModal(false)}
        />
        <ConsumeItem
          item={item}
          show={consumeModal}
          onHide={() => setConsumeModal(false)}
        />
        <EditItem
          item={item}
          show={editModal}
          onHide={() => setEditModal(false)}
        />

        <div className="container  mt-3">
          <div>
            <Table className="table" striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Property #</th>
                  <th>Serial #</th>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Set Items</th>
                  <th>TBI Assigned</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data
                    .filter((item) => {
                      const matchesSearch =
                        search.toLowerCase() === "" ||
                        item.item.toLowerCase().includes(search);
                      const matchesFilter =
                        filter === "All" || item.category === filter;
                      return matchesSearch && matchesFilter;
                    })
                    .map((item) => (
                      <tr key={item.item_id}>
                        <td>{item.item_id}</td>
                        <td>{item.property_num}</td>
                        <td>{item.serial_num}</td>
                        <td>{item.item}</td>
                        <td>{item.description}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>
                          <Button
                            variant="info"
                            onClick={() => toggleSetItemsVisibility(item.item_id)}
                            className="mb-1 mx-auto"
                          >
                            {visibleSetItems[item.item_id] ? <BiHide /> : <BiShow />}
                          </Button>
                          {visibleSetItems[item.item_id] &&
                            Array.isArray(item.set_items) &&
                            item.set_items.length > 0 ? (
                              item.set_items.map((setItem, index) => (
                                <div key={index}>
                                  <div>Property: {setItem.property_num}</div>
                                  <div>Serial: {setItem.serial_num}</div>
                                  <div>Description: {setItem.description}</div>
                                  <br></br>
                                </div>
                              ))
                            ) : (
                              <div></div>
                            )}
                        </td>

                        <td>{item.tbi_assigned}</td>

                        <td className="action">
                          <div className="row ">
                            <div className="col-4">
                              <Button
                                type="button"
                                className="mx-auto action-button"
                                variant="dark"
                                onClick={() =>
                                  item.category === "School Supplies" ||  item.category === "ICT Supplies"
                                    ? handleConsume(item)
                                    : handleBorrow(item)
                                  
                                }
                              >
                                {item.category === "School Supplies" || item.category === "ICT Supplies"
                                  ? "Consume"
                                  : "Borrow"}
                              </Button>
                            </div>
                            <div className="col-1  action-div edit">
                              <Button
                                className="del "
                                variant="dark"
                                onClick={() => handleEdit(item.item_id)}
                              >
                                <FiEdit />
                              </Button>
                            </div>
                            <div className="col-1  action-div">
                              <Button
                                className="del "
                                variant="danger"
                                onClick={() => handleDelete(item.item_id)}
                              >
                                <MdDelete />
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="8">No data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
