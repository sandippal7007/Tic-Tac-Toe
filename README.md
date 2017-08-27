# Tic-Tac-Toe

Hey! This is an online multiplayer tic-tac-toe game, where you can share the url of your hosted app to your partner. 
The project is built using React.js, Express.js, Redis, Ngrok

Steps
-------------
> **Note:**

> - `npm install` to install dependencies.
> - Download Redis and run `redis-server` from the downloaded location locally.
> - Run your UI server via `npm start`. It will start in `localhost:8080`
> - Run your node server via `node app.dev.js`. It will start in `localhost:3000`.
> - I am using ngrok to host my application. To host ngrok for UI server: `./ngrok http -host-header=localhost 8080` and for backend node server `./ngrok http -host-header=localhost 3000`. Now you will get application URL(UI) to share with your friend. Use the https one.
> - Remember to change the variable(backendURL in App.js) as the url you got from ngrok backend server(use the https one). You have to do this step everytime as the url changes when you stop the server.
> - Now you are all set to play the game.
