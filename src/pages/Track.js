import "../App.css";
import { FaSearch } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/esm/Button";
import { MdDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import AddItem from "../components/Modals/AddItem";
import BorrowItem from "../components/Modals/BorrowItem";

const Track = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [borrowModal, setBorrowModal] = useState(false);
  const [borrow_id, setBorrow_id] = useState(null);
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [office, setOffice] = useState("");
  const [person, setPerson] = useState("");
  const [purpose, setPurpose] = useState("");
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/track/borrowed"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  });

  const handleReturn = (props) => {
    setBorrow_id(props.borrow_id);
    setItem(props.item);
    setQuantity(props.quantity);
    setOffice(props.office);
    setPerson(props.person);
    setPurpose(props.purpose);

    const fetchToken = async () => {
        try {
          const response = await axios.get("http://localhost:8000/csrf-token", {
            withCredentials: true,
          });
          // Call the API after setting the token
          returnItem(response.data.csrf_token);
        } catch (error) {
          console.error("Error fetching token:", error);
          setError("Error fetching data. Please try again later.");
          setLoading(false);
        }
      };
  
      fetchToken();
  };

  const returnItem = (csrfToken) =>{
    const returnedData = {
        borrow_id,
        item,
        quantity,
        office,
        person,
        purpose
    }
    

    axios
    .post("http://localhost:8000/track/return", returnedData,{
      headers: {
        "X-CSRF-Token": csrfToken, // Include the CSRF token in headers
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      withCredentials: true,
    })
    .then((response) => {
      console.log("Item Returned:", response.data);
    })
    .catch((error) => {
      console.error("Error Returning item:", error);
      setError("Failed to Return item");
    })
    .finally(() => {
      setLoading(false); // Stop loading indicator
    });

    axios
      .delete(`http://localhost:8000/track/borrowed/delete/${borrow_id}`, {
        headers: {
          "X-CSRF-Token": csrfToken, // Include the CSRF token in headers
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
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
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    const [date, time] = timestamp.split("T");
    let [hours, minutes, seconds] = time.split(".")[0].split(":");
    let period = "AM";
    hours = parseInt(hours, 10);
    if (hours >= 12) {
      period = "PM";
      if (hours > 12) hours -= 12;
    }
    if (hours === 0) hours = 12;
    const formattedTime = `${hours}:${minutes}:${seconds} ${period}`;
    return { date, time: formattedTime };
  };

  return (
    <>
      <div className="container inventory">
        <h1 className="title m-5">Tracking Dashboard</h1>
        <div className="table-wrapper m-5">
          <Table striped bordered hover>
            <thead>
            <tr>
                <th>Date Borrowed</th>
                <th>Time Borrowed</th>
                <th>Expected Return</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>TBI</th>
                <th>Borrower</th>
                <th>Purpose</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {data && data.length > 0 ? (
                data.map((item) => {
                  const { date, time } = formatDateTime(item.created_at);
                  return (
                    <tr key={item.borrow_id}>
                      <td>{date}</td>
                      <td>{time}</td>
                      <td>{item.expected_return}</td>
                      <td>{item.item}</td>
                      <td>{item.quantity}</td>
                      <td>{item.office}</td>
                      <td>{item.person}</td>
                      <td>{item.purpose}</td>
                      <td>
                        <div  className="borrow mx-3"  >
                           <Button variant="dark" onClick={() => handleReturn(item)}>Return</Button>
                        </div>
                       
                      </td>
                    </tr>
                  );
                })
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

export default Track;
