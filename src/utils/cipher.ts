import { decrypt as aesDecrypt, encrypt as aesEncrypt } from 'crypto-js/aes';
import UTF8, { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import Base64 from 'crypto-js/enc-base64';
import MD5 from 'crypto-js/md5';
import SHA256 from 'crypto-js/sha256';
import SHA512 from 'crypto-js/sha512';
import { lib, mode } from 'crypto-js';
import JSEncrypt from 'jsencrypt';

// Define an interface for encryption
// 定义一个加密器的接口
export interface Encryption {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}

// Define an interface for Hashing
// 定义一个哈希算法的接口
export interface Hashing {
  hash(data: string): string;
}

export interface EncryptionParams {
  key: string;
  iv: string;
}

class AesEncryption implements Encryption {
  private key!: lib.WordArray;
  private iv!: lib.WordArray;
  private ivLength: number = 16;
  private ivConcat: boolean = false;
  private cacheKey!: lib.WordArray;
  private cacheIv!: lib.WordArray;

  private static instance: AesEncryption;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): AesEncryption {
    if (!AesEncryption.instance) {
      AesEncryption.instance = new AesEncryption();
    }
    return AesEncryption.instance;
  }

  //设置缓存的aesKey和iv
  public setCache(key: string, iv: string) {
    this.cacheKey = parse(key);
    this.cacheIv = parse(iv);
  }

  //是否拼接IV输出
  public setIvConcat(bool: boolean) {
    this.ivConcat = bool;
    return this;
  }

  public setKey(key?: string) {
    if (key) {
      this.key = Base64.parse(key);
    } else {
      this.key = lib.WordArray.random(32);
    }
    return this;
  }

  public setIv(iv?: string) {
    if (iv) {
      this.iv = Base64.parse(iv);
    } else {
      this.iv = lib.WordArray.random(this.ivLength);
    }
    return this;
  }

  public getKey() {
    return Base64.stringify(this.key);
  }

  public getIv() {
    return Base64.stringify(this.iv);
  }

  private options(iv: lib.WordArray) {
    return {
      mode: mode.CBC,
      padding: pkcs7,
      iv: iv,
    };
  }

  //接口数据加密
  public encrypt(plainText: string) {
    const encrypted = aesEncrypt(plainText, this.key, this.options(this.iv));

    let encryptedCiphertext: lib.WordArray;

    // 是否合并IV
    if (this.ivConcat) {
      // 创建一个新的WordArray来存储拼接的结果
      encryptedCiphertext = lib.WordArray.create([...this.iv.words, ...encrypted.ciphertext.words]);
    } else {
      encryptedCiphertext = encrypted.ciphertext;
    }

    // 返回Base64编码的密文字符串
    return encryptedCiphertext.toString(Base64);
  }

  //接口数据解密
  public decrypt(cipherText: string) {
    // 是否分离IV
    if (this.ivConcat) {
      const decodedData = Base64.parse(cipherText);
      // 分离IV（前16字节）
      this.iv = lib.WordArray.create(decodedData.words.slice(0, this.ivLength / 4));

      // 分离密文（除去IV的部分）
      cipherText = Base64.stringify(
        lib.WordArray.create(decodedData.words.slice(this.ivLength / 4)),
      );
    }
    return aesDecrypt(cipherText, this.key, this.options(this.iv)).toString(UTF8);
  }

  //缓存数据加密
  public encryptCache(plainText: string) {
    return aesEncrypt(plainText, this.cacheKey, this.options(this.cacheIv)).toString();
  }
  //缓存数据加密
  public decryptCache(cipherText: string) {
    return aesDecrypt(cipherText, this.cacheKey, this.options(this.cacheIv)).toString(UTF8);
  }
}

// TODO RSA
class RSAEncryption implements Encryption {
  private static instance: RSAEncryption;

  private key!: string;

  public setKey(key: string) {
    this.key = atob(key);
  }

  public getKey() {
    return this.key;
  }

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): RSAEncryption {
    if (!RSAEncryption.instance) {
      RSAEncryption.instance = new RSAEncryption();
    }
    return RSAEncryption.instance;
  }

  public encrypt(plainText: string) {
    const encrypt = new JSEncrypt();

    encrypt.setPublicKey(this.key); // 设置 RSA 公钥

    // 使用 RSA 公钥加密 AES 密钥
    return encrypt.encrypt(plainText) as string;
  }

  public decrypt(cipherText: string) {
    //TODO
    return Base64.parse(cipherText).toString(UTF8);
  }
}

// Define a singleton class for Base64 encryption
class Base64Encryption implements Encryption {
  private static instance: Base64Encryption;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): Base64Encryption {
    if (!Base64Encryption.instance) {
      Base64Encryption.instance = new Base64Encryption();
    }
    return Base64Encryption.instance;
  }

  public encrypt(plainText: string) {
    return UTF8.parse(plainText).toString(Base64);
  }

  public decrypt(cipherText: string) {
    return Base64.parse(cipherText).toString(UTF8);
  }
}

// Define a singleton class for MD5 Hashing
class MD5Hashing implements Hashing {
  private static instance: MD5Hashing;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): MD5Hashing {
    if (!MD5Hashing.instance) {
      MD5Hashing.instance = new MD5Hashing();
    }
    return MD5Hashing.instance;
  }

  public hash(plainText: string) {
    return MD5(plainText).toString();
  }
}

// Define a singleton class for SHA256 Hashing
class SHA256Hashing implements Hashing {
  private static instance: SHA256Hashing;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA256Hashing {
    if (!SHA256Hashing.instance) {
      SHA256Hashing.instance = new SHA256Hashing();
    }
    return SHA256Hashing.instance;
  }

  public hash(plainText: string) {
    return SHA256(plainText).toString();
  }
}

// Define a singleton class for SHA512 Hashing
class SHA512Hashing implements Hashing {
  private static instance: SHA512Hashing;

  private constructor() {}

  // Get the singleton instance
  // 获取单例实例
  public static getInstance(): SHA512Hashing {
    if (!SHA512Hashing.instance) {
      SHA512Hashing.instance = new SHA512Hashing();
    }
    return SHA512Hashing.instance;
  }

  public hash(plainText: string) {
    return SHA512(plainText).toString();
  }
}

export class EncryptionFactory {
  public static createAesEncryption(): AesEncryption {
    return AesEncryption.getInstance();
  }
  // public static createAesEncryption(params: EncryptionParams): Encryption {
  // return new AesEncryption(params);
  // }

  public static createRsaEncryption(): RSAEncryption {
    return RSAEncryption.getInstance();
  }

  public static createBase64Encryption(): Encryption {
    return Base64Encryption.getInstance();
  }
}

export class HashingFactory {
  public static createMD5Hashing(): Hashing {
    return MD5Hashing.getInstance();
  }

  public static createSHA256Hashing(): Hashing {
    return SHA256Hashing.getInstance();
  }

  public static createSHA512Hashing(): Hashing {
    return SHA512Hashing.getInstance();
  }
}
