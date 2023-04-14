import { KnownMediaType, MediaType } from "./deps.ts";
import { sanitizeFileName } from "./file-name.ts";

export interface TempFileOptions {
  /** Appended to the end of the temporary file name */
  suffix?: string;
  /**
   * If provided, the corresponding file extension for the media type
   * will be appended to the end of the temporary file name
   */
  mediaType?: KnownMediaType;
  /** Appended to the beginning of the temporary file name */
  prefix?: string;
}

export class FileWriter {
  /**
   * Provide a callback {@linkcode cb} that receives a handle to a temporary
   * {@linkcode file} which is automatically closed when the promise returned from the callback resolves.
   * Use {@linkcode options} to control the naming of the temporary file.
   *
   * @returns the filepath of the created file.
   *
   * @notes This is similar to the [`Bracket Pattern`](https://wiki.haskell.org/Bracket_pattern) in Haskell.
   */
  static async withTempFile(cb: (file: Deno.FsFile) => Promise<void>, options: TempFileOptions = {}) {
    const sanitizedOptions = {
      ...options,
      prefix: options.prefix ? sanitizeFileName(options.prefix) : undefined,
    };
    const outputFilePath = FileWriter.makeTempFile(sanitizedOptions);

    const file = await Deno.open(outputFilePath, { write: true, append: true });

    await cb(file);

    try {
      file.close();
    } catch {
      // empty
    }

    return outputFilePath;
  }

  /**
   * Create a temporary file with optional {@linkcode options} values used to control the file name.
   */
  static makeTempFile(options: TempFileOptions = {}) {
    let suffix = options.suffix;
    if (options.mediaType) {
      const mt = MediaType.fromMediaTypeString(options.mediaType);
      if (mt && mt.extensions[0]) {
        suffix += mt.extensions[0];
      }
    }

    return Deno.makeTempFileSync({ prefix: options.prefix, suffix });
  }
}
