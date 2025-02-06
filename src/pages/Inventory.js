import "../App.css";
import { FaSearch } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/esm/Button";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import AddItem from "../components/Modals/AddItem";
import BorrowItem from "../components/Modals/BorrowItem";
import { FaFilter } from "react-icons/fa";

const Inventory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [borrowModal, setBorrowModal] = useState(false);
  const [item, setItem] = useState(null);
  const [search, setSearch] = useState("");
  const [item_id, setItemID] = useState(null);
  const [filter, setFilter] = useState("All");
  // useEffect(() => {
  //     // Step 1: Fetch the CSRF token
  //     axios.get("http://localhost:8000/csrf-token")
  //         .then(response => {
  //             setCsrfToken(response.data); // Directly using response.data as the token
  //         })
  //         .catch(error => {
  //             setError("Error fetching CSRF token");
  //             console.error("Error fetching CSRF token:", error);
  //         });
  // }, []); // Empty array ensures this runs only once when the component mounts
  const handleBorrow = (props) => {
    setItem(props);
    setBorrowModal(true);
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
          <div className="col mb-2 inventory-search">
            <div className="search-wrapper ">
              <FaSearch />
              <input
                placeholder="Search items..."
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-auto mb-2 ">
            <button
              type="button"
              class="btn btn-dark  button-add onClick={() => setAddModal(true)}>"
            >
              Add item
            </button>
          </div>

          <div className="col-auto drop-wrapper mb-2">
            <div class="dropdown-center">
              <button
                class="btn btn-dark dropdown-toggle FaFilter"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                dropdown
              </button>
              <ul class="dropdown-menu mt-2">
                <li>
                  <a class="dropdown-item" href="#">
                    All
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Consumable
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    Non-Consumable
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <AddItem show={addModal} onHide={() => setAddModal(false)} />
        <BorrowItem
          item={item}
          show={borrowModal}
          onHide={() => setBorrowModal(false)}
        />

        <div className="container table-wrapper mt-3">
          <Table className="table" striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>TBI Assigned</th>
                <th>Person</th>
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
                      <td>{item.item}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>{item.tbi_assigned}</td>
                      <td>{item.person}</td>
                      <td>
                        <div className="borrow">
                          {item.category === "Consumable" ? (
                            <Button className=" mx-3" variant="dark">
                              Consume
                            </Button>
                          ) : (
                            <Button
                              className=" mx-3"
                              variant="dark"
                              onClick={() => handleBorrow(item)}
                            >
                              Borrow
                            </Button>
                          )}
                          <Button
                            className="mx-3"
                            variant="danger"
                            onClick={() => handleDelete(item.item_id)}
                          >
                            <MdDelete />
                          </Button>
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
    </>
  );
};

export default Inventory;
