import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './post.model';

@ObjectType()
@Entity()
export class Author {
  @Field((type) => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName: string;

  @Field({ nullable: true })
  @Column({ name: 'last_name', type: 'varchar', nullable: true })
  lastName: string;

  @Field((type) => [Post])
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
