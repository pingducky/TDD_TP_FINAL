export class BookService {
    static isIsbnValid = (isbn: string) => {
        isbn = isbn.replace(/-/g, '');
    
        if (isbn.length !== 10) {
            throw new Error('Invalid ISBN format');
        }
    
        let sum = 0;
    
        for (let i = 0; i < 10; i++) {
            let digit: number;
    
            if (isbn[i] === 'X' && i === 9) {
            digit = 10; // La lettre 'X' représente 10
            } else {
            digit = parseInt(isbn[i], 10);
            if (isNaN(digit)) {
                throw new Error('Invalid ISBN format');
            }
            }
    
            sum += (i + 1) * digit;
        }
    
        return sum % 11 === 0;
    }
}