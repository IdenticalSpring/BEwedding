import { Injectable, ExecutionContext } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';

@Injectable()
export class MockRolesGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        return true;
    }
}