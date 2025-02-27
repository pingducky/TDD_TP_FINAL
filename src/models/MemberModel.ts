import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize"

class MemberModel extends Model {
    public id!: number;
    public lastName!: string;
    public firstName!: string;

}

MemberModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'member',
        timestamps: false,
    }
);

export default MemberModel;
