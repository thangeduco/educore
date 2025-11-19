export interface Worksheet {
  id: number;
  title: string;
  description?: string;
  tags?: string[]; // assuming tags are a list of strings
  downloadUrl: string;
}