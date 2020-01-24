import fileType, { MimeType } from 'file-type';

import { ErrorMessage } from '../types/errors';

const validTypes: MimeType[] = ['image/jpeg', 'image/png', 'image/gif'];

async function validateFileType(buffer: Buffer) {
  const mime = (await fileType.fromBuffer(buffer))?.mime;

  if (!mime || !validTypes.includes(mime)) {
    throw new Error(ErrorMessage.UnsupportedFileType);
  }

  return mime;
}

export default validateFileType;
