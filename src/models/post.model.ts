import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Author } from './author.model';

@ObjectType()
@Entity()
export class Post {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Field((type) => Int, { nullable: true })
  @Column({ name: 'votes', type: 'smallint', nullable: true })
  votes?: number;

  @Field()
  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @Field((type) => Author)
  @ManyToOne(() => Author)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: string;
}
