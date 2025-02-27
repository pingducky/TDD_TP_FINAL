import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize";

export class EditorModel extends Model {
    public id!: number;
    public name!: string;
    public siret!: string | null;
}

EditorModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        siret: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: "editor",
        timestamps: false,
    }
);