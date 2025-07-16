# [0.3.1](https://github.com/brenohsilva/shortener-url/compare/v0.3.0...v0.3.1) (2025-07-16)

### Features

* add logs in the services of the application ([02a31ca](https://github.com/brenohsilva/shortener-url/commit/02a31ca106837057af6bc10fa23a11a1e6ef1a63))
* add logger middleware and filters to handle with specific logs ([f6561bb](https://github.com/brenohsilva/shortener-url/commit/f6561bbc89fae08d7a649c95b1d521e224ac85c0))

# [0.3.0](https://github.com/brenohsilva/shortener-url/compare/v0.2.1...v0.3.0) (2025-07-16)


### Bug Fixes

* fix bug in auth guard ([8f3e3e4](https://github.com/brenohsilva/shortener-url/commit/8f3e3e46df6f1df906399218221b8ba51c771611))


### Features

* add user operations in the shortener ([bf023ff](https://github.com/brenohsilva/shortener-url/commit/bf023ff261c54a68c751c896a5b715a59e5e925d))
* implementing not content interceptor to handle with empty arrays ([4ce1ff1](https://github.com/brenohsilva/shortener-url/commit/4ce1ff14e0071d13d46ac9da8743b61cee7b4899))
* using nest passport to authentication and authorization ([c8796e7](https://github.com/brenohsilva/shortener-url/commit/c8796e780f1a3378558a3e8c60b1b1272285b82b))

### Dependences

* add nest/passport dependence ([3dcbcb5](https://github.com/brenohsilva/shortener-url/commit/3dcbcb5f20343321da7d1abb44f48557466aec4e))

# [0.2.0](https://github.com/brenohsilva/shortener-url/compare/v0.1.0...v0.2.0) (2025-07-15)


### Features

* create generate hash function ([581e172](https://github.com/brenohsilva/shortener-url/commit/581e1720f81f1da0af59519ed522e702be373577))
* implementing auth guard to protect user routes ([2a0b523](https://github.com/brenohsilva/shortener-url/commit/2a0b5233b75bfb1b018434f14fa0716c390679b4))
* implementing authentication ([05d71ec](https://github.com/brenohsilva/shortener-url/commit/05d71ecfeef884045c654c1e3e25344c1ddcb3be))
* implementing user routess ([2716aed](https://github.com/brenohsilva/shortener-url/commit/2716aed0b08ca1671640f7a2a6f468691df95508))

### Dependences
* add nest/jwt dependence ([a85e696](https://github.com/brenohsilva/shortener-url/commit/a85e696e797f3bd048806236cc8fef0aa5054cc9))
* add add bcrypt dependence ([1fcf3d6](https://github.com/brenohsilva/shortener-url/commit/1fcf3d68a24982a5c54e2d57314a6e6c18289d73))



# [0.1.0](https://github.com/brenohsilva/shortener-url/compare/2fe83dc3d9b036d7439c530b1e686f43f1b2c1cb...v0.1.0) (2025-07-13)


### Features

* add validator into create url dto ([6dcc7cb](https://github.com/brenohsilva/shortener-url/commit/6dcc7cb9e70cf537e61ecad47616594d12f83d7d))
* create function to generate unique code ([5148e8d](https://github.com/brenohsilva/shortener-url/commit/5148e8d11a61f06fd75ac0b2d58d6cfbd7531aa9))
* create not found custom error and filter ([b4615b1](https://github.com/brenohsilva/shortener-url/commit/b4615b11634c61948b43f1d6147a4eb2deafce82))
* create routes to create a short url and redirect it ([0569d78](https://github.com/brenohsilva/shortener-url/commit/0569d7852df3cd3da9ebd6c73e9ee356f49aa766))
* create url resource ([a36ead2](https://github.com/brenohsilva/shortener-url/commit/a36ead2a4e74f95f92ac89ac09cf0199016e37ef))
* create user resource ([29309fb](https://github.com/brenohsilva/shortener-url/commit/29309fb0b77296e31e6dd0b950dd48d8eb081929))
* implementing swagger documentation to url resource ([0721a23](https://github.com/brenohsilva/shortener-url/commit/0721a23a6bef13cb6db722198fa4bada697bf6b1))
* increment clicks count when redirect ([ac66277](https://github.com/brenohsilva/shortener-url/commit/ac6627754436f4c8fbc548ae18ab4a6ce92fab43))
* using custom error and filter ([efbb49e](https://github.com/brenohsilva/shortener-url/commit/efbb49e711b07734c3b7cd4363ed1b71c1b0ad57))
* setup initial schema and migrations with prisma ([2fe83dc](https://github.com/brenohsilva/shortener-url/commit/2fe83dc3d9b036d7439c530b1e686f43f1b2c1cb))

#### Dependences

* add nest-swagger dependency ([cf4268d](https://github.com/brenohsilva/shortener-url/commit/cf4268dd8ab068cdc6646f8b31e287bbc5b5a83c))
* add class-validator and class transformer to the dependencies ([d8e01f1](https://github.com/brenohsilva/shortener-url/commit/d8e01f104abb2e983c593f664eb3b7e7e3363d6f))
* add pre-commit hooks with husky and lint-staged ([3fce98f](https://github.com/brenohsilva/shortener-url/commit/3fce98fa6e7007f651a44e25b0834c7419562790))
