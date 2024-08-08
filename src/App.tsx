import { useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);

  const loadData = async () => {
    const result = await window.api.dbQuery("SELECT * FROM users", []);
    setData(result);
  };

  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <div>
        <div>Riley's Budget</div>
        <ul>
          <li>Budget</li>
          <li>Reflect</li>
          <li>All Accounts</li>
          <li>Budget</li>
        </ul>
      </div>
      <div>
        <div>Aug 2024</div>
        <div>All Money Assigned</div>
      </div>
    </div>
  );
}

export default App;
