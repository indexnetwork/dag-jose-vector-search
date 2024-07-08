import { promises as fs } from 'fs';
import axios from 'axios';
import { getRandomDIDSession } from "./wallet.js";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv)).options({
  server_url: { type: 'string', demandOption: true, describe: 'The server URL' },
}).argv;

const SERVER_URL = argv.server_url;


const saveSessionToFile = async (filename, sessionData) => {
  try {
    await fs.writeFile(filename, sessionData, 'utf8');
    console.log('Session saved to', filename);
  } catch (err) {
    console.error('Error saving session to file:', err);
  }
};

const extractTextFromNodes = async (session) => {

  try {
    // Read the JSON file
    const data = await fs.readFile('sample_data.json', 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    let processedCount = 0;

    // Process each node sequentially
    for (let i = 0; i < jsonData.length; i++) {
      const entry = jsonData[i];
      if (entry.node && entry.node.item && entry.node.item.text) {

        const document = { ...entry.node };
        delete document.vector;

        const jwe = await session.did.createDagJWE(
          {
            vector: entry.node.vector,
            document,
          },
          [session.did.id]
        );

        const resp = await axios.post(SERVER_URL + "/index", { jwe }, {
          headers: {
            Authorization: `Bearer ${session.serialize()}`
          }
        });

        processedCount++;
      }
    }

    console.log(`Total nodes processed: ${processedCount}`);
  } catch (err) {
    console.error('Error reading or processing the file:', err);
  }
};

const search = async (session) => {

  try {

    // Read the JSON file
    const data = await fs.readFile('sample_data.json', 'utf8');
    const jsonData = JSON.parse(data);
    const entry = jsonData[100]

	const resp = await axios.post(SERVER_URL + "/search", { 
		vector: entry.node.vector,
		count: 5
	}, {
	  headers: {
	    Authorization: `Bearer ${session.serialize()}`
	  }
	})
  const respData = resp.data

    console.log(`Search result: ${JSON.stringify(respData,0 , 2)}`);
  } catch (err) {
    console.error('Error searching:', err);
  }
};

const main = async () => {
  const session = await getRandomDIDSession();
  await extractTextFromNodes(session);
  await search(session)

};

main();
