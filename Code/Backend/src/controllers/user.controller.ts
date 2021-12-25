// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {
  Credentials,
  TokenServiceBindings,
  MyUserService,
  User,
  UserServiceBindings,
  UserRepository,
} from '@loopback/authentication-jwt';
import {UserExtensionRepository} from "../repositories";
import {authenticate,TokenService} from '@loopback/authentication';
import {model, property, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, HttpErrors,
  post,
  requestBody, response,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {MEMBER_PROJ as USER_PROJ, project} from "./member.controller";
import {ProjRepoRepository} from "../repositories";


@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  github_username: string;

  @property({
    type: 'object',
  })
  avatar?: object;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 6,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(UserExtensionRepository) protected userExtensionRepository: UserExtensionRepository,
    @repository(ProjRepoRepository) protected projectRepoRepository: ProjRepoRepository
  ) {}

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
      @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    console.log('User is logging in');
    try{
      // ensure the user exists, and the password is correct
      const user = await this.userService.verifyCredentials(credentials);

      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user);

      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);
      return {token};
      }
    catch (Error){
      throw new HttpErrors.BadRequest('Login failed');
    }
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(NewUserRequest, {
              title: 'NewUser',
            }),
          },
        },
      })
          newUserRequest: NewUserRequest,
  ): Promise<User> {
    console.log("User is signing up");
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, ['password', 'avatar', 'github_username']),
    );
    const savedUserExt = await this.userExtensionRepository.create(
        _.pick(newUserRequest, ['avatar', 'github_username', 'email']),
    )
    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }
  
  @authenticate('jwt')
  @get('/user/allproject')
  @response(200, USER_PROJ)
  async userAllProject(
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
      ): Promise<project[]>{
    let currentUserID = currentUserProfile[securityId];
    let currentUser = await this.userRepository.findById(currentUserID, {fields: ["email"]});
    let permitViewList = await this.userExtensionRepository.findOne({where: {email: currentUser.email}, fields: ['repo_view_list']});
    if(!permitViewList?.repo_view_list) return [];
    let result: project[] = [];
    for (const projectName of permitViewList.repo_view_list) {
      let project = await this.projectRepoRepository.findOne({where: {full_name: projectName}});
      if(!project) continue;
      result.push({
        name: project.full_name,
        description: project.description? project.description: ' ',
        major: project.language? project.language: ' ',
        stars: project.star_num,
        lastUpdate: project.updated_at,
      })
    }
    return result;
  }
}
