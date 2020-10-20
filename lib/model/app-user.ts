import { Sequelize, Model, DataTypes, Optional, } from "sequelize";
import { UserLog } from './user-log';


// These are all the attributes in the User model
interface UserAttrs {
    id: number;
    name: string;
    preferredName: string;
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserNewAttrs extends Optional<UserAttrs, "id"> { }


export class AppUser extends Model<UserAttrs, UserNewAttrs> implements UserAttrs {
    public id: number; // Note that the `null assertion` `!` is required in strict mode.
    public name: string;
    public preferredName: string

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    logs: UserLog[]
}

export function init(sequelize: Sequelize) {
    AppUser.init({
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        preferredName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: "app_user",
        modelName: AppUser.name,
        freezeTableName: true,
        sequelize,
    });
}
