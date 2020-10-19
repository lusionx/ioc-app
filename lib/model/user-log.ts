import { Sequelize, Model, DataTypes, Optional, } from "sequelize";
import { AppUser } from './app-user';


// These are all the attributes in the User model
interface LogAttrs {
    id: number;
    message: string;
    userId: number
}

// Some attributes are optional in `User.build` and `User.create` calls
interface LogNewAttrs extends Optional<LogAttrs, "id"> { }


export class UserLog extends Model<LogAttrs, LogNewAttrs> implements LogAttrs {
    userId: number;
    message: string;
    public id: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    user: AppUser
}

export function init(sequelize: Sequelize) {
    UserLog.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: "user_log",
        freezeTableName: true,
        sequelize,
    });
}
