import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import { toast } from 'react-toastify';
import '../../styles/components/comments.css';

const Comments = ({ podcastId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [podcastId]);

  const fetchComments = async () => {
    try {
      const response = await commentService.getComments(podcastId);
      setComments(response.comments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
      setLoading(false);
    }
  };
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return '/default-avatar.png';
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://localhost:5000${avatarPath}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      const response = await commentService.addComment(podcastId, newComment);
      setComments([...comments, response.comment]);
      setNewComment('');
      toast.success('Thêm bình luận thành công');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.deleteComment(podcastId, commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
      toast.success('Xoá bình luận thành công');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  return (
    <div className="comments-section">
      <h3>Bình Luận</h3>
      
      {user && (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            maxLength={500}
          />
          <button type="submit">Viết bình luận</button>
        </form>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">Bài đăng chưa có bình luận nào!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
              <div className="comment-user">
                  <img 
                    src={getAvatarUrl(comment.user?.profile?.avatar)} 
                    alt={comment.user?.username}
                    className="comment-avatar"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                  <span className="comment-author">{comment.user?.username}</span>
                </div>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
              {user && (user._id === comment.user._id || user.role === 'admin') && (
                <button 
                  onClick={() => handleDelete(comment._id)}
                  className="delete-comment"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;