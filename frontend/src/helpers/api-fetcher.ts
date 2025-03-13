// TODO: write helpers to fetch from backend API here
import { BlobServiceClient } from '@azure/storage-blob';
export async function uploadFileToADLS(file: File) {
  const sasToken =
    'sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2024-03-15T05:06:52Z&st=2024-03-07T22:06:52Z&spr=https&sig=LjbH7xA8wJrksy%2B%2BlGOWip%2FACqD1AnVBpd6UUv3p628%3D';
  const storageAccountName = 'docsimplstorage';
  const blobService = new BlobServiceClient(
    `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
  );

  const containerClient = blobService.getContainerClient('files'); // get container from storage account
  // await containerClient.createIfNotExists({
  //   access: "container",
  // });
  const blobClient = containerClient.getBlockBlobClient(file!.name); // name of file to be stored in container
  const options = { blobHTTPHeaders: { blobContentType: file?.type } };
  await blobClient.uploadBrowserData(file!, options); // upload file
}
