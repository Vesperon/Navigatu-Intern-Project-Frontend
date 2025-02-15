import "../App.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import axios from "axios";

const Track = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/track/borrowed");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Added [] to run useEffect only once

  const handleReturn = async (borrowItem) => {
    try {
      const response = await axios.get("http://localhost:8000/csrf-token", {
        withCredentials: true,
      });

      const csrfToken = response.data.csrf_token;

      await axios.post(
        "http://localhost:8000/track/return",
        borrowItem,
        {
          headers: {
            "X-CSRF-Token": csrfToken,
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      await axios.delete(`http://localhost:8000/track/borrowed/delete/${borrowItem.borrow_id}`, {
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      // Remove item from state after successful deletion
      setData(data.filter((item) => item.borrow_id !== borrowItem.borrow_id));
    } catch (error) {
      console.error("Error returning item:", error);
      setError("Failed to return item.");
    }
  };

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
    <div className="container inventory mt-4">
      <div className="row justify-content-center container">
        <div className="col ">
          <div className="table-wrapper">
            <div className="table-responsive">
              <Table striped bordered hover className="text-center">
                <thead className="table-dark" striped bordered hover>
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
                            <div className="d-flex justify-content-center">
                              <Button variant="dark" onClick={() => handleReturn(item)}>
                                Return
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9">No data available</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
