import { TypeOrmModule } from '@nestjs/typeorm';
import { PostLoader } from './post.dataloader';
import { Post } from '../models';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostLoader],
  exports: [PostLoader],
})
export class DataLoaderModule {}
