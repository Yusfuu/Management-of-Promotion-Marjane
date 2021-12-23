export const promotionTime = async (req, res, next) => {

  const date = new Date();

  const start = 8 * 60 + 30;
  const end = 12 * 60 + 0;
  const time = date.getHours() * 60 + date.getMinutes();

  const isValid = time >= start && time < end;

  if (!isValid) {
    return res.status(401).json({ error: 'Marjan promotion is close!' });
  }

  next();
}