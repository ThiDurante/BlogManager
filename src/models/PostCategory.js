/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */

module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define(
    'PostCategory',
    {
      postId: {
        type: DataTypes.INTEGER,
        field: 'post_id',
        references: {
          model: 'BlogPost',
          key: 'id',
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        field: 'category_id',
        references: {
          model: 'Category',
          key: 'id',
        },
      },
    },
    { timestamps: false, tableName: 'posts_categories', underscored: true }
  );
  PostCategory.associate = (models) => {
    models.Category.belongsToMany(models.BlogPost, {
      as: 'blog_post',
      through: PostCategory,
      foreignKey: 'categoryId',
      otherKey: 'postId',
    });
    models.BlogPost.belongsToMany(models.Category, {
      as: 'categories',
      through: PostCategory,
      foreignKey: 'postId',
      otherKey: 'categoryId',
    });
  };
  return PostCategory;
};
