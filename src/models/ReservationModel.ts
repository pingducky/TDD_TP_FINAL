import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize"
import MemberModel from "./MemberModel";

class ReservationModel extends Model {
    public id!: number;
    public memberId!: number;
}

ReservationModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        memberId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MemberModel,
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'reservation',
        timestamps: false,
    }
);

export default ReservationModel;