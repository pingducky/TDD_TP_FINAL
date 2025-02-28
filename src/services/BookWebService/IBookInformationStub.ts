import { BookWebServiceResponse, IBookWebService } from "./IBookWebService";

export  class BookWebServiceStub implements IBookWebService {
    private bookData: BookWebServiceResponse = new BookWebServiceResponse(
          "Exemple de Livre",
          "Auteur Fictif",
          "Éditeur Fictif",
          300,
          "Format PDF",
          "123-456-789")

    private bookRequestIsbn: string | null = null;
  
    async getBookInformation(isbn: string): Promise<BookWebServiceResponse> {
      this.bookRequestIsbn = isbn;
      console.log(`Recherche du livre avec l'ISBN: ${isbn}`);
      
      return Promise.resolve(this.getBookData);
    }
  
    public get getBookRequestIsbn(): string | null {
      return this.bookRequestIsbn;
    }
  
    public get getBookData(): BookWebServiceResponse {
      return this.bookData;
    }
  
    public set setBookData(book: BookWebServiceResponse) {
      this.bookData = book;
    }
  }
  