
# Node.js Mongo Example walkthrough

This walkthrough will explain you how to correctly create a microservice to access MongoDB from the DevOps Console.

In order to do so, access to [Mia-Platform DevOps Console](https://console.cloud.mia-platform.eu/login), create a new project and go to the **Design** area. From the Design area of your project select "Microservices" on the menu on the left sidebar and then create a new microservice, you have now reached [Mia-Platform Marketplace](https://docs.mia-platform.eu/development_suite/api-console/api-design/marketplace/)!  
In the marketplace you will see a set of Examples and Templates that can be used to set-up microservices with a predefined and tested function.

For this walkthrough select the following template: **Node.js Custom Plugin with Mongo Example**.
Give to your microservice the following Name: **mongo-example**. Then, fill the other required fields and confirm that you want to create a microservice.  
A more detailed description on how to create a Microservice can be found in [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#2-service-creation) section of Mia-Platform documentation.

This example requires to set the value of an environment variable to work properly. Go to the table *Environment variable configuration* of the newly created microservice *mongo-example* and add the following (key = value):

```js
MONGODB_URL = <YOUR_MONGODB_URL>
```

(remember to replace `<YOUR_MONGODB_URL>` with the real url of your mongoDB)  

More information on how to set an environment variable can be found in [Environment Variable Configuration](https://docs.mia-platform.eu/development_suite/api-console/api-design/services/#environment-variable-configuration) section of Mia-Platform documentation.

In order to access to our new microservice it is necessary to create an endpoint to it.  
In particular, in this walkthrough we will create an endpoint to our microservice *mongo-example*. To do so, from the Design area of your project select "Endpoints" on the menu on the left sidebar and then create a new endpoint.  
Now we need to choose a path for our endpoint and to connect this endpoint to our microservice. Give to your endpoint the following path: **/mongo**. Then, specify that you want to connect your endpoint to a microservice and, finally, select *mongo-example*.  
Step 3 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#3-creating-the-endpoint) section of Mia-Platform documentation will explain in detail how to create an endpoint from the DevOps Console.

After having created an endpoint to your microservice you should save the changes that you have done to your project in the DevOps console.  Remember to choose a meaningful title for your commit (e.g "example_mongo_creation"). After some seconds you will be prompted with a popup message which confirms that you have successfully saved all your changes.  
Step 4 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#4-save-the-project) section of Mia-Platform documentation will explain how to correctly save the changes you have made on your project in the DevOps console.

Once all the changes that we have made are saved, we are now able to deploy our project through the DevOps Console. Go to the **Deploy** area of the DevOps Console.  
Once here, select the environment and the branch you have worked on and confirm your choices clicking on the *deploy* button. When the deploy process is finished you will receveive a pop-up message that will inform you.  
Step 5 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#5-deploy-the-project-through-the-api-console) section of Mia-Platform documentation will explain in detail how to correctly deploy your project.

Now, if you launch the following command on your terminal:

```shell
curl <YOUR_PROJECT_HOST>/mongo/greetings?from=foo
```

(remember to replace `<YOUR_PROJECT_HOST>` with the real host of your project)  
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

Congratulations! You have successfully learnt how to use our Node.js Custom Plugin with Mongo Example on the DevOps Console!
