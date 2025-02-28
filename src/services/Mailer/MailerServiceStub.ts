class MailerServiceStub implements IMailerService {
    private sendMailParam: { to: string; subject: string; body: string } | null = null;
    private sendMailData: boolean = false;
  
    async sendMail(to: string, subject: string, body: string): Promise<boolean> {
      this.sendMailParam = { to, subject, body };
      console.log(`Envoi du mail à ${to} avec le sujet: ${subject}`);
      console.log(`Corps du message: ${body}`);
      return Promise.resolve(this.getSendMailData);
    }

    public get getSendMailParam(): { to: string; subject: string; body: string } | null {
        return this.sendMailParam;
    }

    public get getSendMailData(): boolean {
        return this.sendMailData;
    }

    public set setSendMailData(data: boolean) {
        this.sendMailData = data;
    }
  }
  