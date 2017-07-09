Main server
Handles 2 requests:
- POST /message/:email/:datetime - shedules message delivery
- GET /tokens/limit? - retrieve 10 (or limit) most used tokens with their count

Manages 2 types of services(nodes):
  - Sending agent
  - Tokenizer

When each node is started, it registers itself on master server.

Nodes are stored in a list. On each message master gets next service from the list
and send requests to it (same for tokenizer and sending agent nodes)

If node is unreachable at some moment, master removes it from nodes list.

Master configuraition file contains database connection information and  port, on which it will be run 
(same port should be stated in the tokenizer and sending agent config files).
