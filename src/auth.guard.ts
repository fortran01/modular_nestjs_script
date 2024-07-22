import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

/**
 * Guard that implements authentication check.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Determines if the current user is allowed to proceed with the request.
   * @param context The execution context of the request in NestJS.
   * @returns A boolean or a Promise that resolves to a boolean indicating if access is granted.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  /**
   * Validates the request to check if the required authentication cookie is present.
   * @param request The incoming HTTP request.
   * @returns true if the request has a valid 'customer_id' cookie, otherwise false.
   */
  private validateRequest(request: Request): boolean {
    // Check if the customer_id cookie exists
    return !!request.cookies['customer_id'];
  }
}
