import express from "express";
import bodyParser from "body-parser";
import pkg from "hnswlib-node";
const { HierarchicalNSW } = pkg;
import { getRandomDIDSession } from "./wallet.js";
import { authCheckMiddleware, authenticateMiddleware } from "./middlewares.js";

const app = express();
app.use(bodyParser.json());
const port = 3000;

const indexes = []; // In-memory storage for indexes

// Utility function to get or create an index for a given DID
const getIndexForDID = async (did) => {
  let indexData = indexes.find((index) => index.did === did);
  if (!indexData) {
    const vectors = new HierarchicalNSW("cosine", 1024);
    vectors.initIndex(100000);

    indexData = { did, vectors, documents: [] };
    indexes.push(indexData);
  }
  return indexData;
};

app.use(authenticateMiddleware);

app.post("/index", authCheckMiddleware, async (req, res) => {
  try {
    const indexData = await getIndexForDID(req.did);
    const decoded = await req.session.did.decryptDagJWE(req.body.jwe);

    indexData.documents.push(decoded.document);
    indexData.vectors.addPoint(decoded.vector, indexData.documents.length - 1);

    res.json(indexData);
  } catch (error) {
    res.status(500).json({ error: "Error storing document" });
  }
});

app.post("/search", authCheckMiddleware, async (req, res) => {
  try {
    const { vector, count } = req.body;
    const indexData = await getIndexForDID(req.did);
    const result = indexData.vectors.searchKnn(vector, count);

    const response = result.neighbors.map((neighbor, idx) => ({
      document: indexData.documents[neighbor],
      distance: result.distances[idx],
    }));

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Error searching index" });
  }
});

app.delete("/destroy", authCheckMiddleware, async (req, res) => {
  const indexPosition = indexes.findIndex((index) => index.did === req.did);
  if (indexPosition !== -1) {
    indexes.splice(indexPosition, 1);
    res.json({ message: "Index destroyed" });
  } else {
    res.status(404).json({ message: "Index not found" });
  }
});

app.get("/randomuser", async (req, res) => {
  try {
    const token = await getRandomDIDSession();
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error generating random user" });
  }
});

app.post("/encrypt", authCheckMiddleware, async (req, res) => {
  try {
    const jwe = await req.session.did.createDagJWE(req.body, [
      req.session.did.id,
    ]);
    res.json({ jwe });
  } catch (error) {
    res.status(500).json({ error: "Error encrypting data" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
