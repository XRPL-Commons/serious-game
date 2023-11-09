import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { ProjectsCollection, ObjectId } from '@/server/connectors/mongo'
import { s3Client } from "@/server/connectors/spaces";
import sharp from 'sharp'
import { useAuth } from '~/lib/auth'

interface saveFileProps {
  fileName: string;
  fileContent: any;
  metadata?: any;
}
const saveFile = async ({ fileName, fileContent, metadata = {} }: saveFileProps) => {
  const bucketParams: PutObjectCommandInput = {
    Bucket: "xrpl-media",
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
      "https://xrpl-media.fra1.cdn.digitaloceanspaces.com/" +
      bucketParams.Key
    );
    const url = "https://xrpl-media.fra1.cdn.digitaloceanspaces.com/" +
      bucketParams.Key
    console.log(data)
    return url
  } catch (err) {
    console.log("Error", err);
  }
}

export default defineEventHandler(async (event) => {
  console.log('uploading media')
  // requires authentication
  const auth = useAuth(event?.context?.auth)

  if (!auth.isAdmin) {
    throw createError({ statusCode: 401, statusMessage: 'Not authorized' })
  }

  const files = await readMultipartFormData(event)
  if (!files) {
    throw createError({ statusCode: 400, statusMessage: 'No data' })
  }
  console.log(files)
  const slug = getRouterParam(event, 'slug')

  const fileContent = files[0].data

  // find and load corresponding project
  const Projects = await ProjectsCollection()
  const projectInfo = await Projects.findOne({ slug })
  if (!projectInfo) {
    throw createError({ statusCode: 400, statusMessage: 'Project not found' })
  }
  const metadata = await sharp(fileContent).metadata()
  console.log({ metadata })

  // check for size
  if (!metadata.size || metadata.size > 2000000) {
    throw createError({ statusCode: 400, statusMessage: 'Image size should be less than 2MB!' })
  }

  // check for file type
  if (!metadata.format || ['png', 'jpeg', 'webp', 'svg'].indexOf(metadata.format) === -1) {
    throw createError({ statusCode: 400, statusMessage: 'Image format should be png, jpeg or webp!' })
  }

  // // check for minimum dimensions
  // if (!metadata.width || !metadata.height || (metadata.width < 400 && metadata.height < 400)) {
  //   if (metadata.format !== 'svg') {
  //     throw createError({ statusCode: 400, statusMessage: 'One of the image dimensions should be at least 400px!' })
  //   }
  // }


  // create imageId
  const imgId = Date.now().toString() + Math.random().toString(36).substring(2)

  // create thumbnail
  const thumbnailFile = await sharp(fileContent).resize({
    width: 200,
    height: 100,
    fit: 'inside',
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  }).toBuffer()
  const thumbnail = await saveFile({
    fileName: `map/${slug}/${imgId}_thumbnail.${metadata.format}`,
    fileContent: thumbnailFile,
    metadata: {
      slug,
      projectName: projectInfo.name,
      projectId: projectInfo._id.toString()
    }
  })

  // create main logo
  const logoFile = await sharp(fileContent).resize({
    width: 600,
    height: 300,
    fit: 'inside',
    background: { r: 255, g: 255, b: 255, alpha: 0 }
  }).toBuffer()
  const logo = await saveFile({
    fileName: `map/${slug}/${imgId}_logo.${metadata.format}`,
    fileContent: logoFile,
    metadata: {
      slug,
      projectName: projectInfo.name,
      projectId: projectInfo._id.toString()
    }
  })

  console.log({
    thumbnail,
    logo
  })

  // save thubnail and logo back to record
  return Projects.updateOne({ slug }, {
    $set: {
      thumbnail,
      logo
    }
  })
})

