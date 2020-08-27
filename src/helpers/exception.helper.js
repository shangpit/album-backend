class ExceptionHelper {
  notFound = (res, message = 'Not Found!') => res.status(404).json({ message });

  badRequest = (res, message = 'Bad Request!') => res.status(400).json({ message });

  unAuthorized = (res, message = 'Unauthorized Request!') => res.status(401).json({ message });

  forbidden = (res, message = 'Resource Forbidden!') => res.status(403).json({ message });

  internalServerError = (res, message = 'Internal Server Error!') => res.status(500).json({ message });
}

export default new ExceptionHelper();