import React, { useState } from "react";
import "../styles/ExplorePage.css";

const ExplorePage = ({ isSidebarOpen }) => {
  return (
    <div className={`explore-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Phần "Dành cho bạn" */}
      <div className="section">
        <h2 className="section-title">Dành cho bạn</h2>
        <div className="content-grid">
          {["ngocnhung.jpg", "sample2.jpg"].map((img, index) => (
            <div className="content-card" key={index}>
              <img src={`/images/${img}`} alt={`Daily Mix ${index + 1}`} />
              <p>Daily Mix {index + 1}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Phần "Tuyển tập hàng đầu của bạn" */}
      <div className="section">
        <h2 className="section-title">Tuyển tập hàng đầu của bạn</h2>
        <div className="content-grid">
          {["sample3.jpg", "sample4.jpg"].map((img, index) => (
            <div className="content-card" key={index}>
              <img src={`/images/${img}`} alt={`Tuyển tập ${index + 1}`} />
              <p>Tuyển tập {index + 1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
