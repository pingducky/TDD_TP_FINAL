import { DataTypes, Model } from "sequelize";
import sequelize from "./../config/sequelize";
import BookFormatModel from "./BookFormatModel";
import { EditorModel } from "./EditorModel";
import { AuthorModel } from "./AuthorModel";

class BookModel extends Model {
    public id!: number;
    public isbn!: string;
    public title!: string;
    public editorId!: number;
    public formatId!: number;
    public authorId!: number;
    public isAvailable!: boolean;
    public lastBorrowedAt!: Date | null;
}

BookModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        isbn: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        editorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: EditorModel, key: "id" },
            onDelete: "CASCADE",
        },
        formatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: BookFormatModel, key: "id" },
            onDelete: "CASCADE",
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: AuthorModel, key: "id" },
            onDelete: "CASCADE",
        },
        isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        lastBorrowedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: "book",
        timestamps: false,
    }
);

export default BookModel;
