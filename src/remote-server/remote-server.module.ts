import { Module } from '@nestjs/common';
import { RemoteServerService } from './remote-server.service';

@Module({
  providers: [RemoteServerService],
  exports: [RemoteServerService],
})
export class RemoteServerModule {}
