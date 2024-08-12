export = BufferReader;
declare class BufferReader {
    /**
     * Constructs a new reader from the buffer, starting a the given offset.
     * @param {import('buffer').Buffer} buffer
     * @param {number} offset
     */
    constructor(buffer: import("buffer").Buffer, offset?: number);
    /**
     * @type {import('buffer').Buffer}
     */
    buffer: import("buffer").Buffer;
    /**
     * @type {number}
     */
    offset: number;
    /**
     * @type {number[]}
     */
    stack: number[];
    readInteger(): number;
    readCardinal(): number;
    readSmallInt(): number;
    readByte(): number;
    readWord(): number;
    readWordBool(): boolean;
    readDouble(): number;
    /**
     * Reads a OCAD "wide string" from the buffer. For some OCAD versions,
     * a wide string is a string of 16-bit characters, for others it is a
     * string of 32-bit characters; setting the unicode parameter to true
     * will read 16-bit characters.
     *
     * If the length parameter is not given, the length of the string is read
     * as the first byte from the buffer.
     *
     * @param {boolean} unicode Whether to read 16-bit or 32-bit characters
     * @param {number=} len The length of the string
     * @returns {string}
     */
    readWideString(unicode: boolean, len?: number | undefined): string;
    /**
     * Returns the number of bytes read since the last push() call.
     * @returns {number}
     */
    getSize(): number;
    /**
     * Skips the given number of bytes.
     * @param {number} bytes
     */
    skip(bytes: number): void;
    /**
     * Pushes the current offset onto the stack and sets the offset to the given
     * value.
     * @param {number} offset
     */
    push(offset: number): void;
    /**
     * Pops the current offset from the stack.
     */
    pop(): void;
}
