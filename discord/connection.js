import dotenv from 'dotenv';

dotenv.config();

const sendMessageAfterConnection = (client) => {
    try {
        const channelConnection = process.env.CHANNEL_MSG_CONNECTION;
        client.channels.cache.get(channelConnection).send('Je suis connecté');
    } catch (e) {
        //TODO ?
        console.log(e);
    }
};

export { sendMessageAfterConnection };
