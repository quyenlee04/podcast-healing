import React from "react";


const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    <select className="language-select">
                        <option value="vi">Việt Nam</option>
                        <option value="en">English (UK)</option>
                    </select>
                </div>
                <div className="footer-right">
                    <span>Bản quyền © 2025 Podcast Healing Inc.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
