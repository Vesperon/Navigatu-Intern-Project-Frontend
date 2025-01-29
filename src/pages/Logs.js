import "../App.css";
import { FaSearch } from "react-icons/fa";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import axios from "axios";

const Logs = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

 
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:8000/logs");
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
        <div className="inventory">
          <h1 className="title m-5">Logs Dashboard</h1>
          <div className="search-wrapper m-5">
            <FaSearch />
            <input
              placeholder="Search items..."
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="table-wrapper m-5">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reference ID</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Office</th>
                  <th>Person</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.filter((item)=>{
                    return search.toLowerCase() === ''
                      ? item
                      : item.item.toLowerCase().includes(search);
                  }).map((item) => (
                    <tr key={item.id}>
                    <td>{item.created_at}</td> 
                      <td>{item.reference_id}</td>
                      <td>{item.item}</td>
                      <td>{item.quantity}</td>
                      <td>{item.office}</td>
                      <td>{item.person}</td>
                      <td>{item.purpose}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No data available</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </>
     );
}
 
export default Logs;