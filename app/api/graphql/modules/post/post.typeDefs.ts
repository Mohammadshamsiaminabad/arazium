import gql from "graphql-tag";

export default gql`
  enum PostColor {
    BLACK
    WHITE
    SMOKE_WHITE
    RED
    GREEN
    BLUE
    YELLOW
    ORANGE
    PURPLE
    PINK
    AQUA
    BROWN
  }

  enum PostCategory {
    PANTS
    SUIT
    SHIRT
    TSHIRT
    DRESS
    SKIRT
    JACKET
    COAT
    SHOES
    HAT
    BAG
    ACCESSORY
  }

  enum PostMark {
    NIKE
    ADIDAS
    PUMA
    REEBOK
    VANS
    CONVERSE
    NEW_BALANCE
    UNDER_ARMOUR
    LACOSTE
    GUCCI
    PRADA
    CHANEL
    LOUIS_VUITTON
    HERMES
    BURBERRY
  }

  type ImageType {
    id: Int!
    postId: Int!
    path: String!
  }

  type PostCountType {
    likedBy: Int!
    savedBy: Int!
    postViews: Int!
  }

  type PostType {
    id: Int!
    userId: Int!
    title: String!
    description: String!
    price: Float!
    color: PostColor!
    category: PostCategory!
    mark: PostMark!
    main_image: String!
    images: [ImageType]
    createdAt: String!
    updatedAt: String
    likedBy: Boolean
    dislikedBy: Boolean
    savedBy: Boolean
    lastPostId: Int
    _count: PostCountType
  }

  input PostInput {
    title: String!
    description: String!
    price: Float!
    color: PostColor!
    category: PostCategory!
    mark: PostMark!
    images_path: [String!]!
  }

  input UpdatePostInput {
    title: String
    description: String
    price: Float
    color: PostColor
    category: PostCategory
    mark: PostMark
    images: [String]
    updatedAt: String
  }

  type GetUserPostType {
    posts: [PostType]
    lastPostId: Int
  }

  type Query {
    get_posts(lastPostId: Int): [PostType]
    get_post(id: Int): PostType
    get_liked_posts(lastPostId: Int): GetUserPostType
    get_disliked_posts(lastPostId: Int): GetUserPostType
    get_saved_posts(lastPostId: Int): GetUserPostType
  }

  type Mutation {
    add_post(input: PostInput!): Boolean
    update_post(id: Int!, input: UpdatePostInput!): Boolean
    delete_post(id: Int!): Boolean
    like_post(id: Int!): Boolean
    unlike_post(id: Int!): Boolean
    dislike_post(id: Int!): Boolean
    undislike_post(id: Int!): Boolean
    save_post(id: Int!): Boolean
    unsave_post(id: Int!): Boolean
    visit_post(id: Int!): Boolean
  }
`;