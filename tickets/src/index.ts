// connect to the database
import "./config/database";

import { app } from "./app";

app.listen(3000, () => console.log("Listening in port 3000"));
