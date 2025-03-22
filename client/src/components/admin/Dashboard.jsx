import React, { useState } from "react";
import "../../styles/Dashboard.css";

const podcasts = [
  {
    title: "Biết đang được gì, mất gì - Thùy Minh, Thầy Minh Niệm | Được/Mất #1",
    type: "Được.Mất",
    time: "Thg 6 2024 - 56 phút 39 giây",
    image: "thayminhniem.jpg",
  },
  {
    title: "#1 - Yêu đơn phương.",
    type: "MixiRadio (ft. Yuri)",
    time: "Thg 2 2022 - 31 phút 20 giây",
    image: "mixiradio.jpg",
  },
  {
    title: "MUÔN KIẾP NHÂN SINH | MAHA THERA (PHÁP...)",
    type: "Video Sách Mỗi Ngày",
    time: "Thg 2 2024 - 29 phút 38 giây",
    image: "muonkiep.jpg",
  },
  {
    title: "#43: tình yêu vĩnh viễn không mất đi",
    type: "Thuận Podcast",
    time: "Thg 4 2024 - 26 phút 39 giây",
    image: "love.jpg",
  },
  {
    title: "Làm Sao Sống TRÀN ĐẦY NĂNG LƯỢNG Đúng Nghĩa?",
    type: "Tri Kỷ Cảm Xúc",
    time: "Thg 12 2024 - 42 phút",
    image: "energy.jpg",
  },
  {
    title: "#124: Cách chữa lành cơ thể tận gốc rễ",
    type: "Better Version",
    time: "Thg 5 2024 - 47 phút",
    image: "better.jpg",
  },
  {
    title: "#17: một cá thể độc thân vui vẻ",
    type: "Chất Xám",
    time: "Thg 2 2024 - 28 phút",
    image: "single.jpg",
  },
  {
    title: "#30 - Đàm Phán: Đừng bao giờ chia đôi lợi ích",
    type: "More Perspectives",
    time: "Thg 6 2024 - 32 phút",
    image: "negotiation.jpg",
  },
];

const Dashboard = () => {
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">POPULAR🔥</h1>
      <div className="podcast-grid">
        {podcasts.map((podcast, index) => (
          <div
            key={index}
            className="podcast-card"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <img src={`/images/${podcast.image}`} alt={podcast.title} className="podcast-image" />
            
            <div className="podcast-info">
              <h3 className="podcast-title">{podcast.title}</h3>
              <p className="podcast-type">Tập - {podcast.type}</p>
              <p className="podcast-time">{podcast.time}</p>
            </div>
            <div className="button-group">
              <button className="play" data-tooltip="Phát">▶</button>
              <button className="favorite" data-tooltip="Thêm vào yêu thích">❤️</button>
              <button className="detail" data-tooltip="Chi tiết">ℹ</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
