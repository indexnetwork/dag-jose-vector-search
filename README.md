# dag-jose-vector-search

This project provides a web service for managing documents & vector indexes encoded in DAG-JOSE associated with decentralized identifiers (DIDs). It allows users to store, search, and manage documents and their corresponding vectors using hierarchical navigable small world (HNSW) graphs for efficient nearest neighbor search.



## Usage


### Running the service

To run the Vector Indexing Service using Docker, simply pull the image and run it.

```shell
# Pull the Docker image
docker pull public.ecr.aws/o7v8m7v2/indexnetwork/dag-jose-vector-search:latest-dev

# Run the Docker container
docker run -p 3000:3000 public.ecr.aws/o7v8m7v2/indexnetwork/dag-jose-vector-search:latest-dev`
```

This command will start the service, making it accessible at `http://localhost:3000`


### Running the test script

To run the script with custom parameters, use the following command:


`yarn test --server_url http://localhost:3000`



### Methods

#### 1. Generate Random User

For the convenience of testers, not for production use.

```shell
curl -X GET http://localhost:3000/randomuser
```

#### 2. Encrypt a sample document with vectors.

For the convenience of testers, not for production use.
This service returns JWE object.

```shell
curl -X POST http://localhost:3000/encrypt \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer <TOKEN>" \
         -d '{
           "vector": [1, 2, 3, 4, 4],
           "document": {
             "id": "kjzl6kcym7w8y8hh4cyi3hp83iz70gscpo06oa2kby8r31mum7txt534yjr7frn",
             "conversationId": "kjzl6kcym7w8y7m4otsy2221w1ycvoxdkum02onyi9vd1x3vf8bc5f679fn50k0",
             "controllerDID": {
               "id": "did:key:z6MkmFfvAAMgh2zd6kscS73b6yyJFDNRr8h4EU7AhWnQtcXc"
             },
             "createdAt": "2024-07-05T18:36:24.407Z",
             "updatedAt": "2024-07-05T18:36:35.225Z",
             "deletedAt": null,
             "name": "basic_assistant",
             "role": "assistant",
             "content": "Farcaster is a social network that has recently integrated with the decentralized semantic index..."
           }
         }'
```

#### 3. Index Encrypted JWE

Store a document alongside its vector embeddings using an authorized token. The token is a serialized DIDSession string, and the document is encrypted as a JWE.

```shell
curl -X POST http://localhost:3000/index \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer <TOKEN>" \
         -d '{
            "jwe": <JWE>
         }'
```

#### Search

Search with vector and desired document count.

```shell
curl -X POST http://localhost:3000/search \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer <TOKEN>" \
         -d '{
               "vector": [1, 2, 3, 4, 4],
               "count": 5
             }'
```

#### Destroy

Deletes all in-memory data associated with the user.

```shell
curl -X DELETE http://localhost:3000/destroy \
         -H "Authorization: Bearer <TOKEN>"
```
