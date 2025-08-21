/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - cartId
 *         - userId
 *         - createdAt
 *       properties:
 *         cartId:
 *           type: integer
 *           description: The unique identifier for the cart
 *         userId:
 *           type: string
 *           description: The ID of the user who owns the cart
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the cart was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the cart was last updated
 *         status:
 *           type: string
 *           description: The current status of the cart
 *           enum: [active, checkout, completed, abandoned]
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: The total amount of all items in the cart
 */
export interface Cart {
    cartId: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'checkout' | 'completed' | 'abandoned';
    totalAmount: number;
}