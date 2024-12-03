import { Response, Request } from "express";
import { findUserById, updateUser } from "../services/userServices";
import { errorHandler } from "../services/helpers";

const updateUserRequest = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { userId } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { userId: authUserId } = req.user ;
    const { name, email, password } = req.body.data;

    if (userId !== authUserId) {
      return res.status(401).json({ error: "Access denied" });
    }

    const user = await updateUser(userId, name, email, password);

    return res.status(200).json({
      message: "User updated successfully",
      user: { name: user.name, email: user.email, id: user.id },
    });
  } catch (error: unknown) {
    errorHandler(error, res);
  }
};

export const getUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { userId } = req.params;

    const { userId: authUserId } = req.user ;

    if (userId !== authUserId) {
      return res.status(404).json({ error: "Access denied" });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "User successfully found",
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
    });
  } catch (error: unknown) {
    errorHandler(error, res);
  }
};
export { updateUserRequest };
