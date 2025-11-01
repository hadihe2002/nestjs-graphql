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
import { inspect } from 'util';

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
  async getAuthors(@Context() context: any, @Info() info: GraphQLResolveInfo) {
    console.log(context.req.body.query);

    // Get selected fields
    console.log(
      'Field Nodes:',
      inspect(info.fieldNodes[0].selectionSet, true, 4, true),
    );

    return this.authorRepo.find({ relations: { posts: true } });
  }

  @ResolveField('posts', (type) => [Post])
  async getPosts(@Parent() author: Author) {
    const { id } = author;
    console.log(id);
    return await this.postRepo.find({ where: { authorId: id } });
  }
}
