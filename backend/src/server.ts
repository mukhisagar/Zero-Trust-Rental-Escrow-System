import app from "./app";
import { PORT } from "./utils/config";

app.listen(PORT, () => {
  console.log(`Rental Escrow Backend running on port ${PORT}`);
});
