interface IMailerService {
    sendMail(to: string, subject: string, body: string): Promise<boolean>;
  }
  