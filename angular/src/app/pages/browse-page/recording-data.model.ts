export class RecordingData {
  constructor(
    public readonly recordingId: string,
    public readonly recordingVersion: number,
    public readonly caseRef: string,
    public readonly courtName: string,
    public readonly date: Date,
    public readonly videoLink: string,
    public readonly witness: string,
    public readonly defendants: string[]
  ) {}

  formattedDateString() {
    const day = this.date.getDate();
    const month = this.date.getMonth() + 1;
    const year = this.date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year}`;
  }
}
