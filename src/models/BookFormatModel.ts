import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize"

class BookFormatModel extends Model {
    public id!: number;
    public name!: string;
}

BookFormatModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'book_format',
        timestamps: false,
    }
);

export default BookFormatModel;
