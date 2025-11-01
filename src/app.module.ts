import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorResolver } from './resolvers';
import { Author, Post } from './models';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,

      // http://localhost:3000/graphql
      /* ------------------------------- 1. GraphiQL ------------------------------ */
      graphiql: true,

      /* -------------------------------- 2. Apollo ------------------------------- */
      // playground: false,
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'graph',
      entities: [__dirname + '/**/*.model{.ts,.js}'],
      synchronize: true,
    }),

    TypeOrmModule.forFeature([Post, Author]),
  ],
  providers: [AuthorResolver],
})
export class AppModule {}
