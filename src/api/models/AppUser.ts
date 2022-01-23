import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsAlpha, IsEmail, IsNotEmpty, IsNumberString, IsUUID } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'app_user' })
export class AppUser {
  public static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public static comparePassword(user: AppUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  @IsUUID()
  @PrimaryColumn('uuid')
  public id: string;

  @IsNotEmpty()
  @IsAlpha()
  @Column({ name: 'first_name' })
  public firstName: string;

  @IsNotEmpty()
  @IsAlpha()
  @Column({ name: 'last_name' })
  public lastName: string;

  @IsNotEmpty()
  @Column()
  public address: string;

  @IsNotEmpty()
  @IsNumberString()
  @Column()
  public postCode: string;

  @IsNotEmpty()
  @IsNumberString()
  // @Length(12, 12) // For example: 639123456891
  @Column()
  public contactNo: string;

  @IsNotEmpty()
  @IsEmail()
  @Column()
  public email: string;

  @IsNotEmpty()
  @Column({
    unique: true,
  })
  public username: string;

  @IsNotEmpty()
  @Column()
  @Exclude()
  public password: string;

  public toString(): string {
    return `${this.firstName} ${this.lastName} (${this.email})`;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await AppUser.hashPassword(this.password);
  }
}
