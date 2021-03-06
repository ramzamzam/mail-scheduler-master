Main server
Handles 2 requests:
- POST /message/:email/:datetime - shedules message delivery (message text should be passed in request body)
- GET /tokens/limit? - retrieve 10 (or limit) most used tokens with their count

Manages 2 types of services(nodes):
  - Sending agent
  - Tokenizer

When each node is started, it registers itself on master server.

Nodes are stored in a list. On each message master gets next service from the list
and send requests to it (same for tokenizer and sending agent nodes)

If node is unreachable at some moment, master removes it from nodes list.

Master configuraition file:

```
{
  "PORT": 3002,
  "db": {
    "host": "127.0.0.1",
    "user": "postgres",
    "port": "5432",
    "database": "messages",
    "password": "1111"
  }
}
```

Contains database connection information and  port, on which it will be run 
(same port should be stated in the tokenizer and sending agent config files).

Used database - PostgreSQL 9.5.7
