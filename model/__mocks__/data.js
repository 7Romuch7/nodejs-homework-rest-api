const User = {
  name: 'Guest',
  subscription: 'starter',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDc4MGIwYTMzZjU5M2I1ODY2ZDcwZCIsImlhdCI6MTYxNTMzNDc0NCwiZXhwIjoxNjE1MzM4MzQ0fQ.ZOul5xw2qGjRiFVXE4eKyIcJJ3ubRsVcmlXSm-KzNzg',
  idImg: null,
  _id: '604780b0a33f593b5866d70d',
  email: 'test007@ex.ua',
  password: '$2a$08$ebkI0zFk0IBoStiDDhyzr.9y0BqToGXPtrcTqcMErEuk4JHHF3K8O',
  updatedAt: '2021-03-10T00:05:44.937Z',
  avatar:
    'https://s.gravatar.com/avatar/d6ac26ce64657b23fce03f68f65dc6b4?s=250',
};

const users = [];
users[0] = User;

const newUser = { email: 'test@test.com', password: '123456' };

module.exports = { User, users, newUser };