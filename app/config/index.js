const jwtKey = process.env.TOKEN;
const refreshTokenKey = process.env.REFRESH_TOKEN;

const env = process.env.CONFIG_ENV;


const index = {
    development: {
        env: "development",
        host: "localhost",
        jwtKey,
        refreshTokenKey,
        database: {
            username: "root",
            password: "password",
            name: "boilerplate",
            host: "localhost",
            port: 3306,
        },
        notification: {
            port: 8001
        },
    },
    staging: {
        env: "staging",
        host:'',
        jwtKey,
        refreshTokenKey,
        database: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            name: process.env.DB_NAME,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT
        },
        notification: {
            port: 8001
        },
    }
};

const getConfig = () => {
    return index[env];
};

export default { getConfig };