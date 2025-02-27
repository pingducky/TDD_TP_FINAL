import { BookService } from "../../services/BookService";

test("Doit contenit 10 caractères.", () => {
    expect(() => BookService.isIsbnValid("sksdnesdsbdmsdjs")).toThrow('Invalid ISBN format');
});

test("Doit accepter le format X-XXX-XXXXX-X", () => {
    expect(BookService.isIsbnValid("0-061-96436-0")).toBe(true);
  });
  
test("Doit vérifier que la somme modulo 11 est bien égale à 0.", () => {
    expect(BookService.isIsbnValid("0061964360")).toBe(true);
  });
  
test("Ne doit pas accepter des ISBN avec des lettres", () => {
    expect(() => BookService.isIsbnValid("0061a643b0")).toThrow('Invalid ISBN format');
  });

test("Doit accetper les ISBN une lettre de controle X", () => {
    expect(BookService.isIsbnValid("006196436X")).toBe(false);
  });

test("Ne doit pas accepter les ISBN avec une lettre de controle positionné au mauvais endroit.", () => {
    expect(() => BookService.isIsbnValid("X006098415")).toThrow('Invalid ISBN format');
});
  
  
  