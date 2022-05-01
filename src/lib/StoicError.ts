export default class JoplinError extends Error {
    public code: any = null;
    public details: string | null = '';

    public constructor (message: string, code: any = null, details: string | null = null) {
      super(message)
      this.code = code
      this.details = details
    }
}
