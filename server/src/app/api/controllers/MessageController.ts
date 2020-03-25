import { NextFunction, Request, Response } from 'express';
import { IMessage, Message } from '../../models/mongoose';

class MessageController {
  public index = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const messages: Array<IMessage> = await Message.find().exec();
    return res.status(200).json(messages);
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const message: IMessage = await Message.findById(id).exec();
    return res.status(200).json(message);
  };
}

export default MessageController;
