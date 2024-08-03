# Diet Lens

DietLens is an innovative AI-powered platform designed to revolutionize the way you understand and manage your diet. Empowering individuals to make informed dietary choices and maintain a healthier lifestyle through advanced technology and seamless user experience.

# File Setup Description

The project is built using Springboot and React. The root repository is a springboot project and all frontend code is located within "frontend" directory. Frontend is built using Vite with React and Typescript.

Any changes made to the frontend needs to be followed by a build which should put all necessary javascript and assets into the `src/main/resources` directory appropriately. Currently `npm run build` takes care of this automatically.

# Setup

Before executing the project, make sure you follow through following instructions.

<!-- <details>
<summary>AWS Env Variables </summary>
The project requires communicating with AWS so please export following environment variables:

> export AWS_ACCESS_KEY_ID=<access_key_id>

> export AWS_SECRET_ACCESS_KEY=<secret_access_key>

and if you have a session key, please export that as below:

> export AWS_SESSION_KEY=<session_key>

</details> -->

<details>
<summary>AI Env Variables </summary>
The project requires communicating with OpenAI as well as Azure so please export following environment variables:

> export openai_api_key=<openai_api_key>

> export azure_vision_api_key=<azure_vision_api_key>

> export azure_vision_api_endpoint=<azure_vision_api_endpoint>

</details>
</br>

# Build

Ensure that you have followed all instructions from "Setup" section.

Now, you can run the application from the root directory of the repository.

- Compile: `mvn clean compile`
- Run: `mvn spring-boot:run`

The project should be ready at <a href="http://localhost:8080/">http://localhost:8080</a>.
