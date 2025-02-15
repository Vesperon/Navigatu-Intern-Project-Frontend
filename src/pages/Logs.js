import "../App.css";
import { FaSearch } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaFilter } from "react-icons/fa";

const Logs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/logs");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                <option value="Consume">Consume</option>
                <option value="Borrow">Borrow</option>
                <option value="Add">Add</option>
              </select>
            </div>
          </div>
        </div>

        <div className="container table-wrapper mt-3">
          <Table className="table" striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Reference ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Office</th>
                <th>Person</th>
                <th>Purpose</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data
                  .filter((item) => {
                    const matchesSearch =
                      search.toLowerCase() === ""
                        ? true
                        : item.item
                            .toLowerCase()
                            .includes(search.toLowerCase());

                    const matchesFilter =
                      filter === "All" || item.status === filter;

                    return matchesSearch && matchesFilter;
                  })
                  .map((item) => {
                    const { date, time } = formatDateTime(item.created_at);
                    return (
                      <tr key={item.id}>
                        <td>{date}</td>
                        <td>{time}</td>
                        <td>{item.reference_id}</td>
                        <td>{item.item}</td>
                        <td>{item.quantity}</td>
                        <td>{item.office}</td>
                        <td>{item.person}</td>
                        <td>{item.purpose}</td>
                        <td>{item.status}</td>
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

export default Logs;
