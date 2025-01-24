import { ArgType, NativeFunction } from "@tryforge/forgescript";
import { v4 } from "uuid"; // Assuming you are using uuid for bumpId generation
import { Client, TextChannel } from "discord.js"; // Import discord.js Client and TextChannel

let actives: string[] = [];

export default new NativeFunction({
    name: "$callQueue",
    description: "Manages and sends bump payloads to a set of channels.",
    version: "1.0.0",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "channels",
            description: "A list of channel IDs where the bump payload should be sent.",
            type: ArgType.String,
            required: true,
            rest: false,
        },
    ],
    async execute(ctx, [channels]: [string]) {
        try {
            // Accessing the client from context (ctx.client)
            const client = ctx.client as Client;

            // Check if channels were passed
            if (!channels || channels.length === 0) {
                return this.customError("No channels were provided.");
            }

            // Check if the client has access to channels
            const sentToLimit = Math.floor(channels.length * 0.75);
            let sentTo = 0;

            // Because it's 'client side', all bumps are executing at the same time 
            // so if the array exceeds or is equal to 30, remove the oldest entry to make room for the newest entry.
            if (actives.length >= 30) {
                actives.shift(); // Remove the oldest bump ID
            }

            // You can increase or decrease the number of active bumps being sent. 
            // It's not best to max out your requests per second (req/s), as you have a set limit of 50.
            // Keeping it around 40 might work best until the bot becomes more active, 
            // then you can reduce the number back to 30 or whatever fits.
            const bumpId = v4(); // Generate a new bump ID
            actives.push(bumpId); // Add the bump ID to the active list

            // Loop through each channel in the provided list
            for (const channelId of channels) {
                // Only send to 75% of the channels (to avoid overloading)
                if (actives.includes(bumpId) && sentTo < sentToLimit) {
                    // Fetch the channel using its ID
                    const channel = await client.channels.fetch(channelId);
                    // Ensure that the channel is an instance of TextChannel
                    if (channel && channel instanceof TextChannel) {
                        // Send the bump payload message to the channel
                        await channel.send({ content: `Sending bump payload for: ${bumpId}` });
                        sentTo += 1; // Increment the sentTo counter
                    }
                }
            }

            return this.success("Bump payloads sent successfully.");
        } catch (error) {
            console.error("Error sending bump payloads:", error);
            // Type guard to ensure `error` is an instance of `Error`
            if (error instanceof Error) {
                return this.customError(`An error occurred: ${error.message}`);
            } else {
                // If error is not an instance of Error, log the unknown error
                return this.customError("An unknown error occurred.");
            }
        }
    },
});
