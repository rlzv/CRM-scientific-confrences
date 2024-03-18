const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: { msgBody: "You're not authorized to perform this action", msgError: true }});
    }
  };
  
  module.exports = isAdmin;
