import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize"
import BookModel from "./BookModel";
import ReservationModel from "./ReservationModel";

export class ReservationBookModel extends Model {
    public id!: number;
    public bookId!: number;
    public reservationId!: number;
}

ReservationBookModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: BookModel, key: "id" },
            onDelete: "CASCADE",
        },
        reservationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: ReservationModel, key: "id" },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        tableName: "reservation_book",
        timestamps: false,
    }
);