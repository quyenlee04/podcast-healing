import { useEffect } from "react";
import "../styles/Homepage.css";
import ExplorePage from "./ExplorePage";

const HomePage = () => {
    useEffect(() => {
        document.body.classList.add("home-background");
        return () => {
            document.body.classList.remove("home-background"); // Xóa class khi rời trang
        };
    }, []);

    return (
        <div className="home-container">
            {/* <h1 className="home-title">Chào Mừng Bạn Đến Trang Chủ Website Podcast-Healing</h1>
            <p className="home-description">Nơi Giúp Bạn Chữa Lành Tâm Hồn Đầy Vụn Vỡ Của Bạn</p> */}
            <ExplorePage />
        </div>
    );
};

export default HomePage;
