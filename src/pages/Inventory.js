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
        <div className="row">
          <div className="col button-wrapper mx-5 mt-5 mb-3">
            <button className="button-add" onClick={() => setAddModal(true)}>
              Add Item
            </button>
          </div>
          <div className="col inventory-search">
            <div className="search-wrapper mt-5 mx-3 mb-3">
              <FaSearch />
              <input
                placeholder="Search items..."
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label for="filter">
                <FaFilter></FaFilter>{" "}
              </label>
              <select
                name="filter"
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Consumable">Consumable</option>
                <option value="Non-Consumable">Non-consumable</option>
              </select>
            </div>
          </div>
        </div>

        <AddItem show={addModal} onHide={() => setAddModal(false)} />
        <BorrowItem
          item={item}
          show={borrowModal}
          onHide={() => setBorrowModal(false)}
        />

        <div className="container table-wrapper m-5">
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
