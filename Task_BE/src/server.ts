import { app } from "./app.js";
import { storeData } from "./store.js";

storeData.loadFromFile();

const PORT = 3000;
app.listen(PORT, () => console.log(`API běží na http://localhost:${PORT}`));
