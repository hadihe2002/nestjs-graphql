import {
  Args,
  ID,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Author, Post } from 'src/models';
import { Repository } from 'typeorm';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
    @InjectRepository(Author) private readonly authorRepo: Repository<Author>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
  ) {}

  @Query(() => Author, { name: 'author' })
  async getAuthor(@Args('id') id: string) {
    return this.authorRepo.findOne({ where: { id } });
  }

  @Query(() => [Author], { name: 'authors' })
  async getAuthors() {
    return this.authorRepo.find();
  }

  @ResolveField('posts', (type) => [Post])
  async getPosts(@Parent() author: Author) {
    const { id } = author;
    return await this.postRepo.find({ where: { authorId: id } });
  }
}
