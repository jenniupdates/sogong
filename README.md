# sogong
Maplestory's Sogong Mastermind Game (discord bot)

## Run the app

```
cd server
npm install
npm start
```

Open the `app/index.html` file in a browser. 


when using with react it should be inside an `useEffect` hook, and the clean up should 
disconnect the last socket

```js
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (socketAttributes.ip && socketAttributes.port) {
      const newSocket = io(BASE_URL, {
        extraHeaders: {
          "x-ip": socketAttributes.ip,
          "x-port": socketAttributes.port,
          "x-instance-id": instanceId,
        },
      });
      setSocket(newSocket);
      return () => socket?.close();
    }
  }, [socketAttributes.ip, socketAttributes.port]);

  socket?.on("connection-error", (err) => {
    setConnectionError({ hasErr: true, err });
  });
  socket?.on("connect", () => {
    setIsMainConnected(true);
  });
  socket?.on("disconnect", () => {
    setIsMainConnected(false);
  });
```

## Run the discord bot
1. change guildid to the discord server you want the bot to run in
2. update .env's guildid
3. run `node commands.js` to insert the bot commands
4. upload your files to the bot hosting provider e.g cybrancee
5. host the discord bot on the provider platform and start
6. you should be able to see that the bot is online and use its functions (/start, /input number)

> running locally: `npm run dev` for nodemon packager

## Bot details
Rounds
- last 30s
- optional for input
- each registered socketid can only enter one input and wait for round to end
- new user who join during the current round will only get to play in the next round
- round will continue till round 30

Landing page
- for users to enter the website and register socketid
- ability to change socketid to a personal name
- loading screen
- instructions screen
- panel showing socket ids in the game

Game page
- number input board (0-9): either a pretty board or jus normal message input
- timer showing round duration
- leaderboard panel
- show solution if can’t solve after round 30
- result panel showing current result correct incorrect wrong