import { DirectUpload } from "activestorage";

const RASURL = `api/direct_uploads`;

/**
 * Promisify the create method provided by DirectUpload.
 * @param  {object} upload DirectUpload instance
 * @return {promise}       returns a promise to be used on async/await
 */
function createUpload(upload) {
  return new Promise((resolve, reject) => {
    upload.create((err, blob) => {
      if (err) reject(err);
      else resolve(blob);
    });
  });
}

/**
 * Upload to service using ActiveStorage DirectUpload module
 * @param  {Object} file Image buffer to be uploaded.
 * @return {Object}      blob object from server.
 * @see https://github.com/rails/rails/issues/32208
 */
function activeStorageUpload(file) {
  let imageBlob;
  let token = window.localStorage.getItem("app.Authorization");
  const upload = new DirectUpload(file, RASURL, {
    directUploadWillCreateBlobWithXHR: xhr => {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
  });

  try {
    imageBlob = createUpload(upload);
  } catch (err) {
    throw err;
  }
  return imageBlob;
}

export default activeStorageUpload;

// Usage
// const imageBlob = await activeStorageUpload(imageData);
