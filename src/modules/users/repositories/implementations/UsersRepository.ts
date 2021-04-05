import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const [{ id, first_name, last_name, email, created_at, updated_at }]:User[] = await this.repository.query(`SELECT * FROM users WHERE users.id='${user_id}'`);
    const gamesTitle: Game[] = await this.repository.query(`SELECT games.* FROM users_games_games INNER JOIN games ON games.id=users_games_games."gamesId" WHERE users_games_games."usersId"='${user_id}'`);
    
    const game1: Game = {
      id: gamesTitle[0].id,
      title: gamesTitle[0].title,
      created_at: gamesTitle[0].created_at,
      updated_at: gamesTitle[0].updated_at,
      users: [{
        id, first_name, last_name, email, created_at, updated_at, games: gamesTitle
      }]
    };
    
    const game2 = {
      id: gamesTitle[1].id,
      title: gamesTitle[1].title,
      created_at: gamesTitle[1].created_at,
      updated_at: gamesTitle[1].updated_at,
      users: [{
        id, first_name, last_name, email, created_at, updated_at, games: gamesTitle
      }]
    };
    
    const game3 = {
      id: gamesTitle[2].id,
      title: gamesTitle[2].title,
      created_at: gamesTitle[2].created_at,
      updated_at: gamesTitle[2].updated_at,
      users: [{
        id, first_name, last_name, email, created_at, updated_at, games: gamesTitle
      }]
    };

    const games = [
      game1,
      game3,
      game2
    ]

    const user = {
      id,
      first_name,
      last_name,
      email,
      games,
      created_at,
      updated_at,
    };

    return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name ASC"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`SELECT * FROM users WHERE LOWER(first_name)=LOWER('${first_name}') AND LOWER(last_name)=LOWER('${last_name}')`); // Complete usando raw query
  }
}
