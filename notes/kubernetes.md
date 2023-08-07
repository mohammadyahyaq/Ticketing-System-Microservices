## Diffrence between Pod and Deployment

We could summarize the diffrence between **Pod** and **Deployment** as follows:

1. A pod represents one containarized application
1. Deployment runs one or more pods (replicas)
1. If a pod got shut down inside a deployment, the deployment will restart the pod automatically

## What is a kubernetes Service

A **Service** is a kubernetes object helps any application to get exposed to the network.
There are two main **Services Types**:

1. **Cluster IP:** this is the default service type, and it helps the application to be exposed for the application inside the cluster only.
1. **Load Balancer:** this service helps the service to be exposed from outside the service.

There are also more services types, but they are less common like:- Node Port, and External Name.

## Why we need an Ingress Controller

An ingress controller is a way to hide the complexity of out cluster from outside the network. It will handle the routing and it will act like a bridge between the services and the outside world.

![ingress controller](./ingress%20controller.png)

``
Note: in our application we used Ingress Nginx servics
``

## To create a secret we use the following command:

    kubectl create secret generic **object-name** --from-literal=**ENV_NAME**=**entered-value**
