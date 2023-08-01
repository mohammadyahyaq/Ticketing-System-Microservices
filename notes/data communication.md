# Data Communication

``
Note: in microservices each service should has it's own database, and can't connect to another service database directly
``

Data communication is one of the hardest problems in microservices, because each service might require some data from another service. As an example we could have two services:

1. Cart Service: responsible for storing the products in the user cart
1. Payment Service: responsible for handling the user payment

When the **Payment Service** want to checkout the user, service will require get the data from the **Cart Service** to get the products the user wants to checkout.

## Solution

There are two main solutions for this problem, and each has it's own pros and cons:

1. **Synchronous communication:** when any service needed data from another service, it will make a direct call to that service and get the data from that service
1. **Asynchronous communication:** if any service had a data change, it will fire an event to a service calls an **Event Bus** this service will forward this data to any service subscribed to this event so it could get a copy of that data

## Comparison

| Synchronous Communication                                             | Asynchronous communication                                        |
| --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| very easy easy to implement                                           | deficult to implement                                             |
| introduces coupling between services                                  | each service is decoupled from each other                         |
| if one service went down, all its dependent services will be affected | if one service went down, all other services will not be affected |

``
Note: we could use both synchronous communication and asynchronous communication in one project
``
