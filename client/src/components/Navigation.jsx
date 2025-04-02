// ... existing imports ...

const Navigation = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  
  return (
    <nav>
    
      {isLoggedIn && (
        <Link to="/upload-podcast" className="nav-link">
          <i className="bi bi-cloud-upload"></i> Upload Podcast
        </Link>
      )}
    </nav>
  );
};