# Node.js Mongo Example walkthrough

[![Build Status][github-actions-svg]][github-actions]
[![Coverage Status][coverall-svg]][coverall-io]

This walkthrough will explain you how to correctly create a microservice to access MongoDB from the DevOps Console.

## Create a microservice

In order to do so, access to [Mia-Platform DevOps Console](https://console.cloud.mia-platform.eu/login), create a new project and go to the **Design** area. From the Design area of your project select _Microservices_ and then create a new one, you have now reached [Mia-Platform Marketplace](https://docs.mia-platform.eu/development_suite/api-console/api-design/marketplace/)!  
In the marketplace you will see a set of Examples and Templates that can be used to set-up microservices with a predefined and tested function.

For this walkthrough select the following example: **Node.js Custom Plugin with Mongo Example**.
Give your microservice the name you prefer, in this walkthrough we'll refer to it with the following name: **mongo-example**. Then, fill the other required fields and confirm that you want to create a microservice.  
A more detailed description on how to create a Microservice can be found in [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#2-service-creation) section of Mia-Platform documentation.

## Set an environment variable

This example requires to set the value of an environment variable to work properly. Go to the table *Environment variable configuration* of the newly created microservice *mongo-example* and add the following (key = value):

```js
MONGODB_URL = <YOUR_MONGODB_URL>
```

(remember to replace `<YOUR_MONGODB_URL>` with the real url of your mongoDB)  

More information on how to set an environment variable can be found in [Environment Variable Configuration](https://docs.mia-platform.eu/development_suite/api-console/api-design/services/#environment-variable-configuration) section of Mia-Platform documentation.

## Expose an endpoint to your microservice

In order to access to your new microservice it is necessary to create an endpoint that targets it.  
In particular, in this walkthrough you will create an endpoint to your microservice *mongo-example*. To do so, from the Design area of your project select _Endpoints_ and then create a new endpoint.
Now you need to choose a path for your endpoint and to connect this endpoint to your microservice. Give to your endpoint the following path: **/mongo**. Then, specify that you want to connect your endpoint to a microservice and, finally, select *mongo-example*.  
Step 3 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#3-creating-the-endpoint) section of Mia-Platform documentation will explain in detail how to create an endpoint from the DevOps Console.

## Save your changes

After having created an endpoint to your microservice you should save the changes that you have done to your project in the DevOps console.  Remember to choose a meaningful title for your commit (e.g "created service example_mongo"). After some seconds you will be prompted with a popup message which confirms that you have successfully saved all your changes.  
Step 4 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#4-save-the-project) section of Mia-Platform documentation will explain how to correctly save the changes you have made on your project in the DevOps console.

## Deploy

Once all the changes that you have made are saved, you should deploy your project through the DevOps Console. Go to the **Deploy** area of the DevOps Console.  
Once here, select the environment and the branch you have worked on and confirm your choices clicking on the *deploy* button. When the deploy process is finished you will receveive a pop-up message that will inform you.  
Step 5 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#5-deploy-the-project-through-the-api-console) section of Mia-Platform documentation will explain in detail how to correctly deploy your project.

## Try it

Now, if you launch the following command on your terminal (remember to replace `<YOUR_PROJECT_HOST>` with the real host of your project):

```shell
curl <YOUR_PROJECT_HOST>/mongo/greetings?from=foo
```

You should see the following message:

```json
No greetings found
```

Foo has not sent any greeting, but you can launch a post request on your terminal to change this:

```shell
curl -X POST -H "Content-Type: application/json" -d '{"from":"foo", "to":"bar"}' <YOUR_PROJECT_HOST>/mongo/greetings
```

Now, if you lanch again:

```shell
curl <YOUR_PROJECT_HOST>/mongo/greetings?from=foo
```

the message that you see should be:

```json
{"from":"foo","to":"bar","type":"hello"}
```

Congratulations! You have successfully learnt how to use our Node.js _Custom Plugin with Mongo_ Example on the DevOps Console!

[github-actions]: https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Mongo-Example/actions
[github-actions-svg]: https://github.com/mia-platform-marketplace/Node.js-Custom-Plugin-Mongo-Example/workflows/Node.js%20CI/badge.svg
[coverall-svg]: https://coveralls.io/repos/github/mia-platform-marketplace/Node.js-Custom-Plugin-Mongo-Example/badge.svg?branch=master
[coverall-io]: https://coveralls.io/github/mia-platform-marketplace/Node.js-Custom-Plugin-Mongo-Example?branch=master
