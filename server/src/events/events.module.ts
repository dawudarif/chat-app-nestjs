import { Module } from '@nestjs/common';
import { MainGateway } from './events.gateway';

@Module({ providers: [MainGateway] })
export class EventsModule {}
