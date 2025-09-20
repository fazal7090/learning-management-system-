import { Module,Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1y' },         
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,AuthGuard],
  exports: [AuthGuard,JwtModule]
})
export class AuthModule {}

// import jwt here , and register it but token should be stored in env file (done)
// how applying DTO improves the app (done , it ensures that the data is validated and secure)
// also apply DTO for signup and login (done)
// also apply validation for signup and login
// also apply authentication for signup and login
// also apply authorization for signup and login
// also apply role based authentication for signup and login
// also apply role based authorization for signup and login
// also apply permission based authentication for signup and login
// also apply permission based authorization for signup and login
// also apply audit logging for signup and login