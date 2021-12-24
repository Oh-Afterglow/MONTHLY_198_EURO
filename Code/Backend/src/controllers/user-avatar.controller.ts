// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {authenticate} from "@loopback/authentication";
import {get, oas} from "@loopback/rest";


export class UserAvatarController {
  constructor() {}

  // @authenticate('jwt')
  // @get('/avatar')
  // @oas.response.file('image/jpeg', 'image/png')
  // TODO: Generate url for user's avatar from database.
}
