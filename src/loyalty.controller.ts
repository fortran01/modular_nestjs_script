import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Render,
  Req,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LoyaltyService } from './loyalty.service';
import { AuthGuard } from './auth.guard';

/**
 * Controller to manage loyalty related operations.
 */
@Controller()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  /**
   * Renders the root page with products if logged in.
   * @param request The request object from express.
   * @returns Rendered view with products, login status, and customer ID.
   */
  @Get()
  @Render('index')
  async root(@Req() request: Request) {
    const loggedIn = !!request.cookies['customer_id'];
    const customerId = request.cookies['customer_id'] || null;
    let products = [];
    if (loggedIn) {
      products = await this.loyaltyService.getAllProducts();
    }
    return { logged_in: loggedIn, customer_id: customerId, products };
  }

  /**
   * Handles the login operation for a customer.
   * @param body Contains the customer_id as a string.
   * @param res The response object from express.
   * @returns A JSON response indicating the success or failure of the login.
   */
  @Post('login')
  async login(
    @Body() body: { customer_id: string },
    @Res() res: Response,
  ): Promise<Response> {
    const customerId: string = body.customer_id;
    const customer = await this.loyaltyService.findCustomerById(customerId);

    if (customer) {
      res.cookie('customer_id', customerId);
      return res.json({ success: true });
    } else {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid customer ID' });
    }
  }

  /**
   * Handles the logout operation for a customer.
   * @param res The response object from express.
   * @returns A JSON response indicating the success of the logout.
   */
  @Get('logout')
  logout(@Res() res: Response): Response {
    res.clearCookie('customer_id');
    return res.json({ success: true });
  }

  /**
   * Handles the checkout operation for a customer.
   * @param body Contains an array of product IDs.
   * @param req The request object from express.
   * @param res The response object from express.
   * @returns A JSON response with the result of the checkout operation.
   */
  @Post('checkout')
  @UseGuards(AuthGuard)
  async checkout(
    @Body() body: { product_ids?: number[] },
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    if (!Array.isArray(body.product_ids)) {
      return res.status(400).json({ error: 'product_ids must be an array' });
    }

    const customerId: number = parseInt(req.cookies['customer_id']);
    const result = await this.loyaltyService.checkout(
      customerId,
      body.product_ids,
    );
    return res.json(result);
  }
}
