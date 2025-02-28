import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize";
import MemberModel from "./MemberModel";
import BookModel from "./BookModel"; // Import du modèle Livre

class ReservationModel extends Model {
    public id!: number;
    public memberId!: number;
    public bookId!: number;
    public startDate!: Date;
    public expectedEndDate!: Date;
    public actualEndDate!: Date;
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
                key: "id",
            },
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: BookModel,
                key: "id",
            },
        },
        startDate: { 
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, 
        },
        expectedEndDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        actualEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "reservation",
        timestamps: false,
    }
);

export default ReservationModel;
