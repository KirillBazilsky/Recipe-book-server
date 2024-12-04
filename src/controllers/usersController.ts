import { Response, Request } from "express";
import { updateUser } from "../services/userServices";
import { errorHandler } from "../services/helpers";
import { User } from "../models/Users";
import { userMessages } from "../config/constants";

const updateUserRequest = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: userMessages.validationError });
    }

    const { userId: authUserId } = req.user ;
    const { name, email, password } = req.body.data;

    if (userId !== authUserId) {
      return res.status(401).json({ error: userMessages.validationError });
    }

    const user = await updateUser(userId, name, email, password);

    return res.status(200).json({
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { userId } = req.params;
    const { userId: authUserId } = req.user ;

    if (userId !== authUserId) {
      return res.status(404).json({ error: userMessages.validationError });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: userMessages.notFound });
    }

    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    });
  } catch (error: unknown) {
    return errorHandler(error, res);
  }
};
export { updateUserRequest };
