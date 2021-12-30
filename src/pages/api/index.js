import { ApolloServer, gql } from "apollo-server-micro";
import jwt from 'jsonwebtoken';
import bcrypt  from "bcryptjs";
import { removeCookies, setCookies } from "cookies-next";
const db = require("../../utils/db");

const jwtValidator = token => jwt.verify(token, "TEST_SECRET");

const signToken = (userId) => {
  return jwt.sign({ userId }, "TEST_SECRET", { expiresIn: "1h" });
};

function emptyOrRows(rows) {
  if (!rows) {
    return [];
  }
  return rows;
}

const loginChecker = async (context) => {
  const { req, res } = await context;
  const token = req.headers.authorization;
  const tokenInCookie = req?.headers?.cookie?.split('=')[1];
  if (token) {
    const userInJwt = jwtValidator(token);
    const user = await db.query("SELECT * FROM users WHERE id = ?", [userInJwt.userId]);
    if (!user) {
      throw new Error('Not Authorized');
    }
    return user[0];
  } else if (tokenInCookie) {
    const userInJwt = jwtValidator(tokenInCookie);
    const user = await db.query("SELECT * FROM users WHERE id = ?", [userInJwt.userId]);
    if (!user) {
      throw new Error('Not Authorized');
    }
    return user[0];
  }
  throw new Error('Not Authorized');
}

const typeDefs = gql`
  type Query {
    users: [User!]!
    me: User!
    attendances: [Attendance!]!
    tasks: [Task!]!
    attendance: [Attendance!]!
  }
  type Mutation {
    createUser(name: String!, email: String!, password: String!, role: String!): Message!
    updateUser(id: Int!, name: String!, email: String!, password: String!, role: String!): User!
    deleteUser(id: Int!): User!
    createTask(title: String!, description: String!, user_id: Int!): Message!
    updateTask(id: Int!, title: String!, description: String!, userId: Int!): Task!
    deleteTask(id: Int!): Task!
    createAttendance(user_id: Int!): Message!
    updateAttendance(id: Int!, userId: Int!): Message!
    deleteAttendance(id: Int!): Message!
    login(email: String!, password: String!): Message!
    logout: Message!
  }

  type Task {
    id: Int!
    title: String!
    description: String!
    user_id: Int!
  }
  type Attendance {
    id: Int!
    user_id: Int!
    created_at: String!
    name: String!
    email: String!
    role: String!
  }

  type Task {
    id: Int!
    title: String!
    description: String!
    user: User!
  }

  type Token {
    token: String!
  }

  type User {
    id: Int!
    name: String!
    email: String!
    role: String!
  }
  type Message {
    message: String!
  }
`;

const resolvers = {
  Query: {
    async users(parent, args, context) {
      const user = await loginChecker(context);
      if (!user) throw new Error("Not Authorized");
      return db.query("SELECT id, name, email, role FROM users WHERE role = ?", ["EMPLOYEE"]);
    },
    async me(parent, args, context) {
      const user = await loginChecker(context);
      if (!user) throw new Error("Not Authorized");
      delete user.password;
      return user;
    },
    async attendances(parent, args, context) {
      const user = await loginChecker(context);
      if (!user) throw new Error("Not Authorized");
      if (user.role !== "ADMIN") throw new Error("Not Authorized");
      // get all of today's attendance with user and inner join with user
      const resp = await db.query("SELECT attendance.id, attendance.user_id, attendance.created_at, users.name, users.email, users.role FROM attendance INNER JOIN users ON attendance.user_id = users.id WHERE attendance.created_at = ?", [`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`]);
      return resp;
    },
    async attendance(parent, args, context) {
      const user = await loginChecker(context);
      if (!user) throw new Error("Not Authorized");
      const resp = await db.query("SELECT attendance.id, attendance.user_id, attendance.created_at, users.name, users.email, users.role FROM attendance INNER JOIN users ON attendance.user_id = users.id WHERE attendance.user_id = ?", [user.id]);
      return resp;
    },
    async tasks(parent, args, context) {
      const user = await loginChecker(context);
      if (!user) throw new Error("Not Authorized");
      return db.query("SELECT id, title, description, user_id FROM tasks WHERE user_id = ?", [user.id]);
    }
  },
  Mutation: {
    async createUser(parent, args, context) {
      const { name, email, password, role } = await args;
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `INSERT INTO users (name, email, password, role) VALUES ('${name}', '${email}', '${hashedPassword}', '${role}')`;
      await db.query(query);
      return { message: "User created" };
    },
    async updateUser(parent, args, context) {
      const { id, name, email, password, role } = await args;
      const hashedPassword = await bcrypt.hash(password, 10);
      const query = `UPDATE users SET name='${name}', email='${email}', password='${hashedPassword}', role='${role}' WHERE id=${id}`;
      const updatedUser = await db.query(query);
      return updatedUser;
    },
    async deleteUser(parent, args, context) {
      const { id } = await args;
      const query = `DELETE FROM users WHERE id=${id}`;
      const deletedUser = await db.query(query);
      return deletedUser;
    },
    async createTask(parent, args, context) {
      const { title, description, user_id } = await args;
      const query = `INSERT INTO tasks (title, description, user_id) VALUES ('${title}', '${description}', ${user_id})`;
      const newTask = await db.query(query);
      return { message: "Task created" };
    },
    async updateTask(parent, args, context) {
      const { id, title, description, user_id } = await args;
      const query = `UPDATE tasks SET title='${title}', description='${description}', user_id=${user_id} WHERE id=${id}`;
      const updatedTask = await db.query(query);
      return updatedTask;
    },
    async deleteTask(parent, args, context) {
      const { id } = await args;
      const query = `DELETE FROM tasks WHERE id=${id}`;
      const deletedTask = await db.query(query);
      return deletedTask;
    },
    async createAttendance(parent, args, context) {
      const { user_id } = await args;
      const query = `INSERT INTO attendance (user_id, created_at) VALUES (${user_id}, '${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}')`;
      await db.query(query);
      return { message: "Attendance created" };
    },
    async updateAttendance(parent, args, context) {
      const { id, user_id } = await args;
      const query = `UPDATE attendance SET user_id=${user_id} WHERE id=${id}`;
      const updatedAttendance = await db.query(query);
      return updatedAttendance;
    },
    async deleteAttendance(parent, args, context) {
      const { id } = await args;
      const query = `DELETE FROM attendance WHERE id=${id}`;
      const deletedAttendance = await db.query(query);
      return deletedAttendance;
    },
    async login(parent, args, context) {
      const { email, password } = await args;
      const rows = await db.query("SELECT * FROM users WHERE email=?", [email]);
      const user = emptyOrRows(rows);

      if (!user.length) {
        return { message: "User not found" };
      }
      const valid = await bcrypt.compare(password, user[0].password);
      if (!valid) {
        return { message: "Invalid password" };
      }
      const token = signToken(user[0].id);
      await setCookies('token', token, {
        httpOnly: true,
        maxAge: 3600,
        secure: false,
        req: context.req,
        res: context.res,
      });

      return { message: "Successfully logged in" };
    },
    async logout(parent, args, context) {
      await removeCookies('token', {
        req: context.req,
        res: context.res,
      });
      return { message: "Successfully logged out" };
    },
  }
};

const apolloServer = new ApolloServer({ typeDefs, resolvers, context: async (request, response) => {
  return {
    ...request,
    ...response
  }
} });

const startServer = apolloServer.start();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
