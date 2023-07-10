const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(PORT, () => {
    console.log("server listening on localhost:", PORT);
})
