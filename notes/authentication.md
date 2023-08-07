## Microservices authentication challenges

There are multiple challenges we face in microservices authentication:

1. we can't depend on a central database to store user sessions
1. how each service will know if the user is logged in without being dependent on the **Authentication Service**!!!

## How we will implement it then!

In microservices we have to use **JWT Authentication Strategy**, and each service will verify the user using the **JWT Token Signiture**.

### But this will cause a major sercurity issue!!!

**The problem:**

If there was a malicious user how we will tell the other services that will not accept his token any more.

**The solution:**

We should add two tokens one is an **Access Token** which expires very fast for example 30min, and other one called **Refresh Token** which will be used to update the access token from the authentication service.

**Now if we got malicious user, we could just simply reject his token from being refreshed!!!**
