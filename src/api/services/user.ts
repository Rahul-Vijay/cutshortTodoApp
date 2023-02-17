import {
  IdResponse,
  LoginUserResponse,
} from "@todoapp/api/interfaces/interfaces";
import jwt from "jsonwebtoken";
import User from "../models/user";

function auth(bearerToken: string): Promise<IdResponse> {
  return new Promise(function (resolve, reject) {
    const token = bearerToken.replace("Bearer ", "");
    if (token === "fakeToken") {
      resolve({ id: "fakeUserId" });
      return;
    }

    resolve({
      error: {
        type: "unauthorized",
        message: "Authentication Failed",
        errorMessage: "",
      },
    });
  });
}

function createAuthToken(
  userId: string,
  role: string
): Promise<{ token: string; expireAt: Date }> {
  return new Promise(function (resolve, reject) {
    let jwtPayload = { userId, role };
    jwt.sign(
      jwtPayload,
      "secretKeyyyy",
      {
        algorithm: "RS256",
        expiresIn: "14d",
      },
      (err: Error | null, encoded: string | undefined) => {
        if (err === null && encoded !== undefined) {
          const expireAfter = 2 * 604800; /* 2 weeks */
          const expireAt = new Date();
          expireAt.setSeconds(expireAt.getSeconds() + expireAfter);
          resolve({ token: encoded, expireAt: expireAt });
        } else {
          reject(err);
        }
      }
    );
  });
}

async function login(
  login: string,
  password: string
): Promise<LoginUserResponse> {
  try {
    const user = await User.findOne({ email: login });
    if (!user) {
      return {
        error: {
          type: "invalid_credentials",
          message: "Invalid Login/Password",
          errorMessage: "",
        },
      };
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return {
        error: {
          type: "invalid_credentials",
          message: "Invalid Login/Password",
          errorMessage: "",
        },
      };
    }

    // for role based access
    let role = user.role;
    if (user.role == undefined) {
      role = "user";
    }

    const authToken = await createAuthToken(user._id.toString(), role);
    return {
      userId: user._id.toString(),
      token: authToken.token,
      expireAt: authToken.expireAt,
    };
  } catch (err) {
    console.error(`login: ${err}`);
    return Promise.reject({
      error: {
        type: "internal_server_error",
        message: "Internal Server Error",
      },
    });
  }
}

function createUser(
  email: string,
  password: string,
  name: string
): Promise<IdResponse> {
  return new Promise(async function (resolve, reject) {
    const user = new User({ email: email, password: password, name: name });
    try {
      const u = await user.save();
      resolve({ id: u._id.toString() });
    } catch (err: any) {
      if (err.code === 11000) {
        reject({
          error: {
            type: "account_already_exists",
            message: `${email} already exists`,
            errorMessage: "",
          },
        });
      } else {
        console.error(`createUser: ${err}`);
        reject(err);
      }
    }
  });
}

export default {
  auth: auth,
  createAuthToken: createAuthToken,
  login: login,
  createUser: createUser,
};
