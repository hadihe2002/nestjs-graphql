import {
  Args,
  Resolver,
  Query,
  Context,
  Info,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Author, Post } from 'src/models';
import { Repository } from 'typeorm';
import type { GraphQLResolveInfo } from 'graphql';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(
    @InjectRepository(Author) private readonly authorRepo: Repository<Author>,
  ) {}

  @Query(() => Author, { name: 'author' })
  async getAuthor(@Args('id') id: string) {
    return this.authorRepo.findOne({ where: { id } });
  }

  @Query(() => [Author], { name: 'authors' })
  async getAuthors(@Context() context: any, @Info() info: GraphQLResolveInfo) {
    console.log(context.req.body.query);

    return this.authorRepo.find();
  }

  @ResolveField('posts', () => [Post])
  async getPosts(@Parent() author: Author, @Context() context) {
    return context.postLoader.load(author.id);
  }
}
