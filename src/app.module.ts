import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorResolver } from './resolvers';
import { Author, Post } from './models';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostLoader } from './dataloader';
import { DataLoaderModule } from './dataloader/dataloader.module';

@Module({
  providers: [AuthorResolver],
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataLoaderModule],
      inject: [PostLoader],
      useFactory: async (postLoader: PostLoader) => ({
        autoSchemaFile: true,
        playground: true,
        sortSchema: true,
        graphiql: true,
        context() {
          return { postLoader: postLoader.createLoader() };
        },
      }),
    }),

    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.model{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Post, Author]),

    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   sortSchema: true,

    //   // http://localhost:3000/graphql
    //   /* ------------------------------- 1. GraphiQL ------------------------------ */
    //   graphiql: true,

    //   /* -------------------------------- 2. Apollo ------------------------------- */
    //   // playground: false,
    //   // plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),
  ],
})
export class AppModule {}
