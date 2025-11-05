import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../models';
import { In, Repository } from 'typeorm';
import DataLoader from 'dataloader';

@Injectable()
export class PostLoader {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  createLoader() {
    return new DataLoader(async (authorIds: string[]) => {
      const posts = await this.postRepository.find({
        where: { authorId: In(authorIds) },
      });

      const postsByAuthor = new Map<string, Post[]>();
      posts.forEach((post) => {
        const existing = postsByAuthor.get(post.authorId) || [];
        postsByAuthor.set(post.authorId, [...existing, post]);
      });

      return authorIds.map((id) => postsByAuthor.get(id) || []);
    });
  }
}
