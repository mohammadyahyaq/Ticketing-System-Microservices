## Enviroment setup

1. install docker desktop
2. enable kubernetes via docker settings
3. install skaffold following [skaffold docs](https://skaffold.dev/)
4. add JWT_KEY enviroment variable because it's used inside the auth service via the following command

```
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=<STRIPE_KEY>
```

5. run the code via the following command

```
skaffold dev
```

### Optional

**_Note: you need to add this line of code in the "/etc/hosts" file_**

> 127.0.0.1 ticketing.dev
