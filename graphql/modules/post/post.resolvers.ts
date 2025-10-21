import { PostType } from "./post.type";
import prisma from "@/app/api/graphql/prisma";
import { MyContext } from "@/app/api/graphql/route";
import deleteFile from "@/app/api/graphql/config/deleteFile";
import path from "path";
const resolver = {
  Query: {
    get_posts: async (_: unknown, args: { lastPostId: number  }) => {
      try {
        const posts = await prisma.post.findMany({
          take: 20,
          ...(args.lastPostId != null
            ? {
                skip: 1,
                cursor: { id: args.lastPostId },
              }
            : {}),
          orderBy: { id: "desc" },
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            color: true,
            category: true,
            mark: true,
            main_image: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return posts;
      } catch (err) {
        console.error("❌ get_posts error:", err);
        return [];
      }
    },

    get_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        await prisma.postViews.upsert({
          where: { 
            postId_userId: {
              postId: args.id,
              userId: context.user.userId
            }
          },
          create: {
            postId: args.id,
            userId: context.user.userId,
          },
          update: {}
        });
        const [post, liked, saved] = await Promise.all([
          prisma.post.findUnique({
            where: { id: args.id },
            include: {
              images: { orderBy: { order: "asc" } },
              _count: {
                select: {
                  likedBy: {
                    where: { like: true }
                  },
                  savedBy: true,
                  postViews: true,
                }
              }
            },
          }),
          prisma.likedPost.findFirst({
            where: { postId: args.id, userId: context.user.userId },
            select: { like: true }
          }),
          prisma.savedPost.findFirst({
            where: { postId: args.id, userId: context.user.userId },
            select: { id: true }
          }),
        ]);
        const result = {
          ...post,
          ...(liked === null ? {
            likedBy: false,
            dislikedBy: false,
          } : {
            likedBy: liked?.like ? true : false,
            dislikedBy: liked?.like ? false : true,
          }),
          savedBy: saved?.id ? true : false,

        }
        return result;
      } catch(err) {
        console.error(err);
        return null;
      }
    },

    get_liked_posts: async (_: unknown, args: { lastPostId: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const likedPostIds = await prisma.likedPost.findMany({
          where: { userId: context.user.userId, like: true },
          take: 20,
          ...(args.lastPostId != null ? {
            skip: 1,
            cursor: { id: args.lastPostId }
          } : {}),
          orderBy: { postId: "desc" },
          select: {
            id: true, 
            postId: true,
          }
        });
        if (!likedPostIds.length && !args.lastPostId) throw new Error("تا حالا پستی را لایک نکرده اید");
        const likedPost = await prisma.post.findMany({
<<<<<<< HEAD
          where: { id: { in: likedPostIds.map((post : { postId: number }) => post.postId) } },
=======
          where: { id: { in: likedPostIds.map((post: { postId: number; }) => post.postId) } },
>>>>>>> 4855bd5ac04b41deef1d87b5a775625e6754f56b
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            color: true,
            category: true,
            mark: true,
            main_image: true,
          }
        });

        return {
          posts: likedPost,
          lastPostId: likedPostIds.length ? likedPostIds[likedPostIds.length - 1].id : null,
        };
      } catch(err) {
        console.error(err);
        throw err;
      }
    },

    get_disliked_posts: async (_: unknown, args: { lastPostId: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const dislikedPostIds = await prisma.likedPost.findMany({
          where: { userId: context.user.userId, like: false },
          take: 20,
          ...(args.lastPostId != null ? {
            skip: 1,
            cursor: { id: args.lastPostId }
          } : {}),
          orderBy: { postId: "desc" },
          select: {
            id: true,
            postId: true
          }
        });
        if (!dislikedPostIds.length && !args.lastPostId) throw new Error("تا حالا هیچ پستی را دیس‌لایک نکرده اید");
        const dislikedPost = await prisma.post.findMany({
<<<<<<< HEAD
          where: { id: { in: dislikedPostIds.map((post : { postId: number }) => post.postId) } },
=======
          where: { id: { in: dislikedPostIds.map((post : { postId: number; }) => post.postId) } },
>>>>>>> 4855bd5ac04b41deef1d87b5a775625e6754f56b
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            color: true,
            category: true,
            mark: true,
            main_image: true,
          }
        });
        if (!dislikedPost) throw new Error("مشکلی پیش امد");
        return {
          posts: dislikedPost,
          lastPostId: dislikedPostIds.length ? dislikedPostIds[dislikedPostIds.length - 1].id : null,
        };
      } catch(err) {
        console.error(err);
        throw err;
      }
    },

    get_saved_posts: async (_: unknown, args: { lastPostId: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const savedPostIds = await prisma.savedPost.findMany({
          where: { userId: context.user.userId },
          take: 20,
          ...(args.lastPostId != null ? {
            skip: 1,
            cursor: { id: args.lastPostId }
          } : {}),
          orderBy: { postId: "desc" },
          select: {
            id: true,
            postId: true,
            userId: true,
          }
        });
        console.log(savedPostIds);
        if (!savedPostIds.length && !args.lastPostId) throw new Error("تا حالا هیچ پستی ذخیره نکرده اید");
        const savedPost = await prisma.post.findMany({
<<<<<<< HEAD
          where: { id: { in: savedPostIds.map((post: { postId: number }) => post.postId) } },
=======
          where: { id: { in: savedPostIds.map((post: { postId: number; }) => post.postId) } },
>>>>>>> 4855bd5ac04b41deef1d87b5a775625e6754f56b
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            color: true,
            category: true,
            mark: true,
            main_image: true,
          }
        });
        if (!savedPost) throw new Error("مشکلی پیش آمد");
        return {
          posts: savedPost,
          lastPostId: savedPostIds.length ? savedPostIds[savedPostIds.length - 1].id : null,
        };
      } catch(err) {
        console.error(err);
        throw err;
      }
    },
  },

  Mutation: {
    add_post: async (_: unknown, args: { input: PostType }, context: MyContext) => {
      const { input } = args;
      const { title, description, price, color, category, mark, images_path } = input;
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const newPost = await prisma.post.create({
          data: {
            userId: context.user.userId,
            title,
            description,
            price,
            color,
            category,
            mark,
            main_image: images_path[0],
            images: {
              create: images_path.map((img: string, index: number) => ({
                path: img,
                order: index
              })),
            },
          },
          include: {
            images: true,
            user: true,
          }
        });
        if (!newPost) throw new Error("در هنگام ساختن پست جدید سرور به مشکل خورد");
        return true;
      } catch (err) {
        console.error("❌ add_post error:", err);
        return false;
      }
    },

    update_post: async (_: unknown, args: { id: number, input: PostType }) => {
      const { id, input } = args;
      try {
        const existing = await prisma.postImages.findMany({
          where: { postId: id },
          select: { path: true }
        });
        const dbTransaction = await prisma.$transaction([
          prisma.postImages.deleteMany({ where: { postId: id } }),
          prisma.postImages.createMany({
            data: input.images.map((img, index) => ({
              path: img,
              postId: id,
              order: index
            }))
          }),
          prisma.post.update({
            where: { id },
            data: {
              title: input.title,
              description: input.description,
              price: input.price,
              color: input.color,
              mark: input.mark,
              main_image: input.images[0]
            }
          })
        ]);
        if (!dbTransaction) throw new Error("database error");
        const existingPathes = existing.map(i => i.path);
        const incomingPathes = input.images.map(i => i);
        const toDelete = existingPathes.filter(path => !incomingPathes.includes(path)) 
        toDelete.forEach((file) => {
          const res = path.join(process.cwd(), "public", file);
          deleteFile(res);
        });
        return true;
      } catch(err) {
        console.error(err);
        input.images.forEach((img) => {
          const res = path.join(process.cwd(), "public", img);
          deleteFile(res);
        });
        return false;
      }
    },

    delete_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const images = await prisma.postImages.findMany({
          where: { postId: args.id },
          select: { path: true }
        });
        const deletePost = await prisma.post.deleteMany({ where: { id: args.id } });
        if (!deletePost) throw new Error("هنگام حذف پست سرور به مشکل خورد");
        images.forEach((img) => {
          const res = path.join(process.cwd(), "public", img.path);
          deleteFile(res);
        });
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },
  
    like_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const likePost = await prisma.likedPost.upsert({
          where: {
            userId_postId: {
              userId: context.user.userId,
              postId: args.id
            }
          },
          create: {
            userId: context.user.userId,
            postId: args.id,
            like: true,
          },
          update: { like: true },
        });
        if (!likePost) throw new Error("oops!");
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    },

    unlike_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const unlike_post = await prisma.likedPost.deleteMany({
          where: { 
            userId: context.user.userId,
            postId: args.id
          }
        });
        if (!unlike_post) throw new Error("oops!");
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },

    dislike_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const dislike_post = await prisma.likedPost.upsert({
          where: {
            userId_postId: {
              userId: context.user.userId,
              postId: args.id,
            }
          },
          create: {
            userId: context.user.userId,
            postId: args.id,
            like: false,
          },
          update: { like: false }
        });
        if (!dislike_post) throw new Error("oops!");
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },

    undislike_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const undislike_post = await prisma.likedPost.deleteMany({
          where: {
            userId: context.user.userId,
            postId: args.id
          }
        });
        if (!undislike_post) throw new Error("oops!");
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },

    save_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const save_post = await prisma.savedPost.create({
          data: {
            userId: context.user.userId,
            postId: args.id,
          },
          include: {
            user: true,
            post: true,
          }
        });
        if (!save_post) throw new Error("oops!");
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },

    unsave_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const unsave_post = await prisma.savedPost.deleteMany({
          where: {
            AND: [
              { userId: context.user.userId },
              { postId: args.id }
            ]
          }
        });
        if (!unsave_post) throw new Error("oops!");
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },

    visit_post: async (_: unknown, args: { id: number }, context: MyContext) => {
      try {
        if (!context.user) throw new Error("ابتدا وارد حساب کاربری خود شوید");
        const visited_post = await prisma.postViews.upsert({
          where: {
            postId_userId: {
              postId: context.user.userId,
              userId: args.id
            },
          },
          create: {
            userId: context.user.userId,
            postId: args.id
          },
          update: {}
        });
        if (!visited_post) throw new Error("مشکلی پیش اومد");
        return true;
      } catch(err) {
        console.error(err);
        return false;
      }
    },
  },
};

export default resolver;
