import {
  Options,
} from "ftp";

export interface FtpConfig {
  options: Options;
  remote_path_root?: string;
}
