export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  privacy?: boolean;
}

export interface UserResponseDto {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  privacy: boolean;
  createdAt: Date;
}
