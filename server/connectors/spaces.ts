import { S3 } from "@aws-sdk/client-s3"
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3'

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
    accessKeyId: 'DO00Z3L4PBAHK3FTY6ND',
    secretAccessKey: 'wUQCkr11VhGpeNer0sFgbNys3uk2gOzwOMSXhRDF/Qs'
  }
})

interface saveFileProps {
  fileName: string;
  fileContent: any;
  metadata?: any;
}

const saveFile = async ({ fileName, fileContent, metadata = {} }: saveFileProps) => {
  const bucketParams: PutObjectCommandInput = {
    Bucket: "albers",
    Key: fileName,
    Body: fileContent,
    ACL: 'public-read',
    Metadata: metadata
  }

  console.log(bucketParams)
  try {
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    console.log(
      "Successfully uploaded object: " +
      "https://albers.fra1.cdn.digitaloceanspaces.com/" +
      bucketParams.Key
    );
    const url = "https://albers.fra1.cdn.digitaloceanspaces.com/" +
      bucketParams.Key
    console.log(data)
    return url
  } catch (err) {
    console.log("Error", err);
  }
}

export { saveFile }