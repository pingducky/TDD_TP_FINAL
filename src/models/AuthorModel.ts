import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize";

export class AuthorModel extends Model {
    public id!: number;
    public lastName!: string;
    public firstName!: string;
}

AuthorModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "author",
        timestamps: false,
    }
);
