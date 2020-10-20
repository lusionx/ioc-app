import { Sequelize, Model, DataTypes, } from "sequelize";

interface Userinfo {
    nickname: string
}

interface WxUserinfoAttr {
    openid: string
    appid: string
    userinfo: Userinfo
}


export class WxUserinfo extends Model<WxUserinfoAttr> implements WxUserinfoAttr {
    openid: string;
    appid: string;
    userinfo: Userinfo;
    userId: number;
    message: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export function init(sequelize: Sequelize) {
    const defined = {
        openid: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        appid: {
            type: DataTypes.STRING,
        },
        userinfo: {
            type: DataTypes.STRING(2047),
            get(this: WxUserinfo) {
                const tt = this.getDataValue('userinfo') as unknown as string
                return JSON.parse(tt)
            },
            set(this: WxUserinfo, dd: Userinfo) {
                const vv = JSON.stringify(dd) as any
                this.setDataValue('userinfo', vv);
            }
        },
    }
    WxUserinfo.init(defined, {
        tableName: "wx_userinfo",
        modelName: WxUserinfo.name,
        freezeTableName: true,
        sequelize,
    });
}
