import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize";

class MailModel extends Model {
    public id!: number;
    public sender!: string;
    public reciptient!: string;
    public subject!: string;
    public body!: string;
    public sentAt!: Date;
}

MailModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reciptient: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subject: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sentAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "mail",
        timestamps: false,
    }
);

export default MailModel;
