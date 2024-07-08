# dag-jose-vector-searc

This project provides a web service for managing documents & vector indexes encoded in DAG-JOSE associated with decentralized identifiers (DIDs). It allows users to store, search, and manage documents and their corresponding vectors using hierarchical navigable small world (HNSW) graphs for efficient nearest neighbor search.

### Features

#### 1. Generate Random User

For the convenience of testers, not for production use.

```shell
curl -X GET http://localhost:3000/randomuser
```

#### 2. Encrypt a sample document with vectors.

For the convenience of testers, not for production use.
This service uses DAG-JWE to for encryptions.

```shell
curl -X POST http://localhost:3000/encrypt \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer 05159422a2aeaaefa68fd756f11196a4e13757ed6ef4b55ce007736bc65fff60" \
         -d '{
               "data": {
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
               }
             }'
```

#### 3. Index Encrypted JWE

Store a document alongside its vector embeddings using an authorized token. The token is a serialized DIDSession string, and the document is encrypted as a JWE.

```shell
curl -X POST http://localhost:3000/store \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer 05159422a2aeaaefa68fd756f11196a4e13757ed6ef4b55ce007736bc65fff60" \
         -d '{
               "jwe": {
                 "protected": "eyJlbmMiOiJYQzIwUCJ9",
                 "iv": "dhjYT_BVnqUvfjW0LNfDPpfYPnnUALU7",
                 "ciphertext": "xfAvAMBTYZihcAEcWN4rkfhU-VUR6R7Y7wJHPjvG9NXImLWkpTwdEOh-mJKxnwXiBMiHd7igzcjrqrpt5fAvZUC039iT0sOPDjxzp2m2S4LYcXjDzLaodJGtFwI4N_GYyaB27tvCz4DGySdLPpBP7jgUJUOIdwGEGfQ_Te_u8I3a2qS7bE4WcapX0-FDoghH2GJRvuVOnnO1EbdqgB8PcbEBkzPmO1qsZouzD87AW5tk7MTqVDTtNC10H_gy0SlaUnzBUhcJ7IjJaunTLg2GH8G12wxse65eBeuTylVI2i7WX6z7wos2n1zH9_BrKVLsMjrvuhf-0WhxjKHkAf67zsm9K884QYPcIFoHqtsBEM7VJ8AfQNeF4lR6-7h9F4MWFpLdpf_AiGfQgmHpFx2GOOxVARFER5mh0T2xXGqw74kYJyTUaM0GFxSG_l26ANnzRtxvr3fv1VC4NznL85ZPWJxAILeBFMklhpwO_uclfEyU1zln6BPzpZT5G7g7CRK9wSoR-iz9i-Q_RJtuU5vgTm2Turg35balRn7jf6GrOvU69ihSVvbpZdyhTsX8Y8w8MpBv0BlGcHL49UmNCAbCSjUAROSrBCH9ClTPouPJiyS2SXvMj36dFn8eGaFnRYn_CIi3Sle0B-n-UUjMAdGFh7omwx21e5Lx1tfA_4Yfrdgmv2qP0GqQrHB2fO05UT1w3iN6_qp-fkFMVWxmudJi6rLFsIPPdUrWYjmib5MjpzFNitwjMI0T01zA5fWWY5owdhj81tCBVyh_MqXcTt60u3WGuaDVZ2RdLcyt5fS_52RvKWt7y3igxlAogUZDS6SJJQc3_zQFBFihTr-1HsKOjtsnlgcPGaswu-FwIsl-nWyg7jt4ZsIH1Wcu3cqN7ovszMicpNtN-mdb6K695nB0tW2J_41SUXd7QZeDj1-YTsAo6OIYQdR9ycq-pm9y1cDS0AK-XoWNJ54-NrUfcJz-taRf0qkO0oT21YEhAG4O1lJrpEqSC4VlD9KzooirgiTEPzeQK2zxeYLuoFT0EW1ppOthTsppWMvg0b-FePMIMXKjIj1QnSzbXXmmtskW6yiMVg0WjlUqKsxgCxru7_YAU3JRq0YnTLSjZG_korc-w5NUKcUJFd4SXaSxVa1UfpwKSkJUsFohP7wXvxG6vatljXyV7frY7UeXdLxwb8MP-i4FJNQh8StPP-VJQo3VkWE6YqHuPSsKCOIbvr_rlhMNG0U6sk7EyMxKbKOxWw3zJsOk6YmGA_yGUHGBcdt5sBOAYEfzB2uag1Cmu3QWjlmA4S5pfExqZ7kB2P0Hb2pS3Q9coQCoZQ1qpDpBYi5_mtBXTrhFxQXNex4KwuDU0T9QturPm0mzXxHuteuzePnDwUwxTCItHoHU-0LS97rk03g6VYVwf-00NZfBAul5p-P9_i4mmDrViCn-VobWoTtkDoCBf70yOrAEbtQCaLN5mNruf2OTmjI-TfAKi-N_ijs0MyLUGGVVGwc1",
                 "tag": "6hpVa1sS3zw-s68o3sd9mQ",
                 "recipients": [
                   {
                     "encrypted_key": "2H8f-Q3Z4w9EaSG-NhWR_TXqEA0EVV_BCnkSVzmvT_s",
                     "header": {
                       "iv": "REqh0sEwEIYRgnPf3OKVm3rfEWirsPvK",
                       "tag": "kTkYRGr3UZC3xCTPvFGdhQ",
                       "kid": "did:key:z6MkjcASDecw3bVDo7t1bAJouT3TU7NYMbMCY5Pks4ZCgt73#z6LSjAtfa5yDHhnBWggFNERSzV4HTySFDmD7kc5xQ8a22UZR",
                       "alg": "ECDH-ES+XC20PKW",
                       "epk": {
                         "kty": "OKP",
                         "crv": "X25519",
                         "x": "Y4SKnBUMQDNrlzL9rnWfDdHy6CcWwI6inxAH2V4YcSQ"
                       }
                     }
                   }
                 ]
               }
             }'
```

#### Search

Search with vector and desired document count.

```shell
curl -X POST http://localhost:3000/search \
         -H "Content-Type: application/json" \
         -H "Authorization: Bearer 05159422a2aeaaefa68fd756f11196a4e13757ed6ef4b55ce007736bc65fff60" \
         -d '{
               "vector": [1, 2, 3, 4, 4],
               "count": 5
             }'
```

#### Destroy

Deletes all in-memory data associated with the user.

```shell
curl -X DELETE http://localhost:3000/destroy \
         -H "Authorization: Bearer 05159422a2aeaaefa68fd756f11196a4e13757ed6ef4b55ce007736bc65fff60"
```

### Docker Usage

To run the Vector Indexing Service using Docker, simply pull the image and run it.

```shell
# Pull the Docker image
docker pull public.ecr.aws/o7v8m7v2/indexnetwork/dag-jose-vector-search:latest-dev

# Run the Docker container
docker run -p 3000:3000 public.ecr.aws/o7v8m7v2/indexnetwork/dag-jose-vector-search:latest-dev`
```

This command will start the service, making it accessible at `http://localhost:3000`
