
export interface ProjectRecord {
  name: string,
  slug: string,
  description: string,
  section: string,
  category: string,
  tags: string[],
  url: string,
  grants: string,
  accelerator: string,
  status: string,
  thumbnail: string,
  launchDate: Date,
  logo: string,
  hideName: boolean,
  visible: boolean,
}
