import app from "./app";
import { config } from "@/config/env";

const PORT: number = config.app.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
