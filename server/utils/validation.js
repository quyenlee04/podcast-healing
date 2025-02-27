class Validator {
    static validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    }
  
    // Password strength validation
    static validatePassword(password) {
      // At least 8 characters, one uppercase, one lowercase, one number
      const strongRegex = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})"
      );
      return strongRegex.test(password);
    }
  
    // Validate podcast upload
    static validatePodcastUpload(podcast) {
      const errors = [];
  
      if (!podcast.title) errors.push('Title is required');
      if (!podcast.category) errors.push('Category is required');
      if (!podcast.audioUrl) errors.push('Audio file is required');
  
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  }
  
  module.exports = Validator;
  