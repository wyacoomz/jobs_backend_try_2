import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import config from "./src/config/env.config.js";

const port = config.PORT || 5000;

app.listen(port, () => {
  connectDB();
  console.log(`Server running port at: http:localhost:${port}`);
});
