const redis = require("redis");

const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1",
});

client.on("connect", () => {
    console.log("Client connected to redis...");
});

client.on("ready", () => {
    console.log("Client connected to redis and ready to use...");
});

client.on("error", (err) => {
    console.log(err.message);
});

client.set("foo", "bar", (err, reply) => {
    if (err) throw err;
    console.log(reply);
});

client.get("foo", (err, reply) => {
    if (err) throw err;
    console.log(reply);
});

console.log(client);

client.on("end", () => {
    console.log("Client disconnected from redis...");
});

process.on("SIGINT", () => {
    client.quit();
});

module.exports = client;

// const client = (async () => {
//     const client = redis.createClient({
//         port: 6379,
//         host: "127.0.0.1",
//     });

//     const connection = await client.connect();

//     console.log(connection, client);

//     client.on("error", (err) => console.log("Redis Client Error", err));

//     client.on("connect", () => {
//         console.log("Client connected to redis...");
//     });

//     client.on("ready", () => {
//         console.log("Client connected to redis and ready to use...");
//     });

//     client.on("end", () => {
//         console.log("Client disconnected from redis...");
//     });

//     process.on("SIGINT", () => {
//         client.quit();
//     });

//     await client.set("key", "value");
//     const value = await client.get("key");

//     console.log(value);

//     return client;
// })();

module.exports = client;
