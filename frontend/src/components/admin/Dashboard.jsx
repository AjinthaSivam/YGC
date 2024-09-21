import React from "react";
 import AdminPanel from "./AdminPanel";

const Dashboard = () => {
  return (
      <div className="content">
        <AdminPanel />
          <h2>Dashboard</h2>
          <p>Overview of the institute's performance and statistics.</p>
          {/* Display key metrics here, e.g., student count, course count, etc. */}
      </div>
  );
};

export default Dashboard;
