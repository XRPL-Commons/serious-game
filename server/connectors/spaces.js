import { S3 } from "@aws-sdk/client-s3"

// const settings = {
//   "url": "https://xrpl-media.fra1.digitaloceanspaces.com",
//   "region": "fra1",
//   "bucket": "xrpl-media",
//   "accessKeyId": "DO006AABU63UPZ2RXBAT",
//   "secretAccessKey": "xbpKkUbrolxm6PB0shN82a6EitEi6JZCtjZAN4OYpQ0"
// }

const s3Client = new S3({
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "fra1",
  credentials: {
    accessKeyId: 'DO006AABU63UPZ2RXBAT',
    secretAccessKey: 'xbpKkUbrolxm6PB0shN82a6EitEi6JZCtjZAN4OYpQ0'
  }
})

export { s3Client }