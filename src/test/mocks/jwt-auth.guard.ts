import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class MockJwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return true;
    }
}