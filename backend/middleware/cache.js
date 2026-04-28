import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 });

export const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached) {
    console.log("✅ Cache hit:", key);
    return res.json(cached);
  }
  res.sendResponse = res.json.bind(res);
  res.json = (data) => {
    cache.set(key, data);
    res.sendResponse(data);
  };
  next();
};