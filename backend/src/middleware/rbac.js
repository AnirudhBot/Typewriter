export const authorize = (requiredRole) => {
  return (req, res, next) => {
    const roleHierarchy = {
      admin: ["admin", "editor", "viewer"],
      editor: ["editor", "viewer"],
      viewer: ["viewer"],
    };

    if (!req.user || !roleHierarchy[req.user.role]?.includes(requiredRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
