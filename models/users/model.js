import crypto from "crypto";
import jwt from "jsonwebtoken";
//const email = require('../../app/utils/email'); TODO update to import and create email index and template
import generator from "generate-password";
import models from '../index.js';
import * as config from "../../app/config/index.js";
config.getConfig();
import dotenv from 'dotenv'
dotenv.config({ silent: true });
const token = process.env.TOKEN || "tokenEmptyReplaceByVarInEnv";
const refreshToken = process.env.REFRESH_TOKEN || "refreshTokenEmptyReplaceByVarInEnv";
const EXPIRATION_SECONDS = process.env.EXPIRATION_SECONDS || 604800; //1 week

//Model user
export default (sequelize, DataTypes) => {
    const user = sequelize.define(
        "users",
        {
            //1. Unique properties
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            //1.A. Auth values                                                                                     //
            email: { type: DataTypes.STRING, unique: true, required: true },
            //Password
            password: { type: DataTypes.TEXT, required: true },
            //passwordTwo: { type: DataTypes.TEXT, allowNull: false },
            salt: { type: DataTypes.TEXT },
            //Token
            tokenSignature: { type: DataTypes.TEXT },
            token: { type: DataTypes.TEXT },
            refreshToken: { type: DataTypes.TEXT },
            refreshTokenSignature: { type: DataTypes.TEXT },

            cgu: { type: DataTypes.BOOLEAN, required: true },
            privacyPolicy: {type: DataTypes.BOOLEAN, required: true},

            //For recovery password
            linkRandom: {type: DataTypes.TEXT, allowNull: true},
            linkConfirmationEmail: {type: DataTypes.STRING, allowNull: true},


            //Optional
            lastName: { type: DataTypes.STRING, allowNull: true },
            firstName: { type: DataTypes.STRING, allowNull: true },
            birthDate: { type: DataTypes.TEXT, allowNull: true },
        },
        {
            defaultScope: {
                attributes: {
                    exclude: [
                        "password",
                        "salt",
                        "tokenSignature",
                        "refreshTokenSignature",
                    ],
                },
            },
            scopes: {
                all: { attributes: { exclude: [] } },
            },
            tableName: "users",
        }
    );

    // Generates password if none is given then hashes it. (necessitates salt)
    user.prototype.setPassword = function (password = false) {
        password = !password
            ? generator.generate({ length: 10, numbers: true })
            : password;
        this.salt = crypto.randomBytes(16).toString("hex");
        this.password = crypto
            .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
            .toString("hex");
        return password;
    };

    //Create a link for get a new password
    user.prototype.setLinkRandom = function (linkRandom = false) {
        linkRandom = !linkRandom
            ? generator.generate({ length: 10 })
            : linkRandom;
        this.linkRandom = linkRandom;

        return linkRandom;
    }

    //Compare the password for authentication
    user.prototype.validatePassword = function (password) {
        const encrypted = crypto
            .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
            .toString("hex");
        return this.password === encrypted;
    };
    //Return the response in json with all information necessary
    user.prototype.toAuthJSON = function () {
        if (this.linkConfirmationEmail === null || this.linkConfirmationEmail === "") {
            var emailConfirmation = true;
        } else {
            var emailConfirmation = false;
        }
        return {
            id: this.id,
            email: this.email,
            token: this.token,
            refreshToken: this.refreshToken,
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate,
            emailConfirmation : emailConfirmation,

        };
    };
    //Tech for generate the token
    user.prototype.generateJWT = function () {
        return jwt.sign(
            {
                email: this.email,
                id: this.id,
            },
            token,
            { expiresIn: "604800s" }//1 week
        );
    };
    //Tech for generate the refresh token
    user.prototype.generateRefreshToken = function () {
        return jwt.sign(
            {
                email: this.email,
                id: this.id,
            },
            refreshToken,
            { expiresIn: "60d" }//2 month
        );
    };

    //Call all function token and add in the model
    user.prototype.login = function () {
        this.token = this.generateJWT();
        this.refreshToken = this.generateRefreshToken();
        this.tokenSignature = this.token.split(".")[2];
        this.refreshTokenSignature = this.refreshToken.split(".")[2];
        //this.lastConnectionAt = Date.now();
    };

    user.prototype.updatePassword = function (password) {
        var newInformations = {
            salt: null,
            password: null
        }
        newInformations.salt = crypto.randomBytes(16).toString("hex");
        newInformations.password = crypto
            .pbkdf2Sync(password, newInformations.salt, 10000, 512, "sha512")
            .toString("hex");
        return newInformations;
    }



    //For generate salt and hash de password before the create user
    user.beforeCreate((user, options) => {
        user.salt = crypto.randomBytes(16).toString("hex");
        user.password = crypto
            .pbkdf2Sync(user.password, user.salt, 10000, 512, "sha512")
            .toString("hex");
    });
    /*user.associate = (models) => {
        user.hasMany(models.***, { //TODO replace *** by models name
            foreignKey: 'userId',
            as: 'pictureUser'
        })
    }*/
    return user;
};