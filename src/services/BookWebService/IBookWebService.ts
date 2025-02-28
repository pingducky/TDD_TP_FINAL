export class BookWebServiceResponse {
    constructor(
      public title: string,
      public author: string,
      public publisher: string,
      public pageCount: number,
      public format: string,
      public isbn: string
    ) {}
  }

export interface IBookWebService {
    getBookInformation(isbn: string): Promise<BookWebServiceResponse>;
  }